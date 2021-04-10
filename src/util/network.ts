import got, { OptionsOfTextResponseBody } from 'got';
import Cache from 'node-cache';
import hexoLogger from 'hexo-log';

const log = hexoLogger();
const cache = new Cache({
  stdTTL: 60
});

export async function getPage(url: string, options?: OptionsOfTextResponseBody): Promise<string | undefined> {
  if (cache.has(url)) {
    log.info(`Reading Page from Cache: ${url}`);
    return cache.get(url);
  }

  log.info(`Fetching Page: ${url}`);

  const { body, statusCode } = await got(url, {
    retry: { limit: 2 },
    headers: {
      'User-Agent': 'Mozilla/5.0 New Auction'
    },
    ...options
  });

  if (statusCode >= 200 && statusCode < 300 || statusCode === 304) {
    cache.set(url, body);
  }

  return body;
}
