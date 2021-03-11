import got, { OptionsOfTextResponseBody ***REMOVED*** from 'got';
import Cache from 'node-cache';
import hexoLogger from 'hexo-log';

const log = hexoLogger();
const cache = new Cache({
  stdTTL: 60
***REMOVED***);

export async function getPage(url: string, options?: OptionsOfTextResponseBody): Promise<string | undefined> {
  if (cache.has(url)) {
    log.info(`Reading Page from Cache: ${url***REMOVED***`);
    return cache.get(url);
  ***REMOVED***

  log.info(`Fetching Page: ${url***REMOVED***`);

  const { body, statusCode ***REMOVED*** = await got(url, {
    retry: { limit: 2 ***REMOVED***,
    headers: {
      'User-Agent': 'Mozilla/5.0 New Auction'
    ***REMOVED***,
    ...options
  ***REMOVED***);

  if (statusCode >= 200 && statusCode < 300 || statusCode === 304) {
    cache.set(url, body);
  ***REMOVED***

  return body;
***REMOVED***
