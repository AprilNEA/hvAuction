import got, { OptionsOfTextResponseBody } from 'got';
import Cache from 'node-cache';
import hexoLogger from 'hexo-log';

const log = hexoLogger();
const cache = new Cache({
  stdTTL: 60
});

export async function getPage(url: string, options?: OptionsOfTextResponseBody, ttl?: number): Promise<string | undefined> {
  if (cache.has(url)) {
    log.info('[Main]', `Reading Page from Cache: ${url}`);
    return cache.get(url);
  }

  log.info('[Main]', `Sending network request to: ${url}`);

  const { body, statusCode } = await got(url, {
    retry: { limit: 2 },
    headers: {
      'User-Agent': 'Mozilla/5.0 New Auction'
    },
    ...options
  });

  if (statusCode >= 200 && statusCode < 300 || statusCode === 304) {
    if (ttl) {
      cache.set(url, body, ttl);
    } else {
      cache.set(url, body);
    }
  }

  return body;
}
