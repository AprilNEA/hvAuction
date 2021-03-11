import cheerio from 'cheerio';
import got from 'got';
import fsPromises from 'fs/promises';
import { resolve ***REMOVED*** from 'path';

(async () => {
  const { body: rangeDBResp ***REMOVED*** = await got('https://reasoningtheory.net/viewranges', {
    retry: { limit: 2 ***REMOVED***,
    headers: {
      'User-Agent': 'Mozilla/5.0 New Auction'
    ***REMOVED***
  ***REMOVED***);

  const $ = cheerio.load(rangeDBResp);
  const rawRangeDB = $('script[data-itemRanges]').attr('data-itemranges');

  if (rawRangeDB) {
    const data = [
      '// THIS FILE WAS AUTOMATICALLY GENERATED',
      '// DO NOT EDIT THIS CODE BY HAND',
      '// YOU CAN REGENERATE IT USING "npm run updateDB"',
      `export const EQUIPMENT_RANGES = ${rawRangeDB***REMOVED***;\n`
    ].join('\n');

    await fsPromises.writeFile(resolve(__dirname, '../src/lib/equip/rangeDB.ts'), data);
  ***REMOVED***
***REMOVED***)();
