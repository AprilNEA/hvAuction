import got, { OptionsOfTextResponseBody, Response } from 'got';
import hexoLogger from 'hexo-log';
import deepmerge from 'deepmerge';

const log = hexoLogger();
const cache = new Map();

/** Options for the fetch queue and all fetch requests. */
interface IFetchQueueOptions {
  /** Max live connection count of the queue. Default to 4. */
  maxConnections?: number;
  interval?: number;
}

/** Promise that can cancel the request. */
interface IFetchQueuePromise<T = any> extends Promise<T> {
  /** Cancel the request and remove it from the queue. */
  cancel(): void;
}

enum ItemState {
  Pending,
  Active,
  Succeeded,
  Failed,
  Canceled
}

interface IQueueItem {
  readonly url: string;
  readonly init?: OptionsOfTextResponseBody;
  readonly resolve: (value: Response) => void;
  readonly reject: (reason?: any) => void;
  state: ItemState;
}

/**
 * Request queue base on fetch() API.
 */
class FetchQueue {
  /** Fetch queue options. */
  public readonly options: IFetchQueueOptions;

  /** Count of requests pending in the queue. */
  public get pendingCount(): number {
    return this.pendingItems.length;
  }

  /** Count of active request sending out. */
  public get activeCount(): number {
    return this.activeItems.length;
  }

  private pendingItems: IQueueItem[] = [];
  private activeItems: IQueueItem[] = [];
  private isPaused = false;
  private lastCalled: number;
  private timer?: number;
  private isFirstCall: boolean;

  /**
   * Create a fetch queue.
   * @param options Queue options.
   */
  public constructor(options?: IFetchQueueOptions) {
    this.options = {
      maxConnections: 4,
      interval: 300,
      ...options
    };

    this.lastCalled = Date.now();
    this.isFirstCall = true;
  }

  /**
   * Add a request to the end of the queue.
   *
   * @param url Request url
   * @param init Request init for fetch() API
   * @returns {IFetchQueuePromise} Request promise that can also cancel the request.
   */
  public add(url: string, init?: OptionsOfTextResponseBody): IFetchQueuePromise<Response<string>> {
    let item: IQueueItem;
    const promise = new Promise((resolve, reject) => {
      item = { url, init, resolve, reject, state: ItemState.Pending };
      this.pendingItems.push(item);
    }) as IFetchQueuePromise;
    promise.cancel = () => this.cancel(item);

    this.checkNext();

    return promise;
  }

  /** Pause the pending list. */
  public pause(): void {
    this.isPaused = true;
  }

  /** Resume the pending list. */
  public resume(): void {
    this.isPaused = false;
    this.checkNext();
  }

  /** Override max connections */
  public setMaxConnections(connections: number): void {
    this.options.maxConnections = connections;
  }

  private cancel(item: IQueueItem): void {
    switch (item.state) {
      case ItemState.Pending:
        this.pendingItems = this.pendingItems.filter((i) => i !== item);
        break;
      case ItemState.Active:
        // It is sending out. Cannot really cancel the request. Just ignore the response.
        break;
      default:
        // Do noting if it is already finished/canceled
        return;
    }
    item.state = ItemState.Canceled;
    item.reject('Canceled');
  }

  private checkNext() {
    const threshold = this.lastCalled + (this.options?.interval || 300);
    const now = Date.now();

    // Adjust timer if it is called too early
    if (now < threshold && !this.isFirstCall) {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => { this.checkNext(); }, threshold - now) as unknown as number;
      return;
    }

    this.isFirstCall = false;

    while (!this.isPaused && this.pendingCount > 0 && this.activeCount < this.options.maxConnections!) {
      const item = this.pendingItems.shift()!;
      this.activeItems.push(item);
      item.state = ItemState.Active;

      got(item.url, {
        retry: { limit: 2 },
        headers: {
          'User-Agent': 'Mozilla/5.0 Xuan\'s Auction'
        },
        cache,
        ...item.init
      }).then(
        (resp) => {
          if (resp.isFromCache) {
            log.info('[FetchQueue]', 'Hit from cache');
          } else {
            log.info('[FetchQueue]', 'Miss from cache');
          }

          if ((resp.statusCode >= 200 && resp.statusCode < 300 || resp.statusCode === 304) && (item.init?.method === 'GET' || typeof item.init === 'undefined')) {
            cache.set(item.url, resp);
          }
          this.handleResult(item, ItemState.Succeeded, resp);
        },
        (reason) => this.handleResult(item, ItemState.Failed, reason)
      );
    }
  }

  private handleResult(item: IQueueItem, state: ItemState, result: any) {
    this.activeItems = this.activeItems.filter((i) => i !== item);

    if (item.state === ItemState.Active) {
      item.state = state;
      if (state === ItemState.Succeeded) {
        item.resolve(result);
      } else {
        item.reject(result);
      }
    }

    this.lastCalled = Date.now();
    this.timer = setTimeout(this.checkNext, this.options?.interval || 300) as unknown as number;
  }
}

export const fetchQueue = new FetchQueue({
  maxConnections: 4,
  interval: 300
});

// Flush cache every 60 seconds
setInterval(() => {
  cache.clear();
}, 60000);

export async function getPage(url: string, options?: OptionsOfTextResponseBody, enableCookie?: boolean): Promise<string | undefined> {
  log.info('[getPage] Fetching Page:', url);

  if (enableCookie) {
    options = deepmerge(options || {}, {
      headers: {
        cookie: `${(options?.headers?.cookie) ? (`${options.headers.cookie};`) : ''}ipb_member_id=${process.env.ipb_member_id}; ipb_pass_hash=${process.env.ipb_pass_hash}`
      }
    });
  }

  const { body } = await fetchQueue.add(url, options);
  return body;
}
