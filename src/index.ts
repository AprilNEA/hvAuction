import express from 'express';
import hexoLogger from 'hexo-log';
import { bidItemsRequestHandler, repliesListRequestHandler ***REMOVED*** from './auction';

(async () => {
  const log = hexoLogger();

  const app = express();
  const port = 3001;

  app.use(express.json({
    limit: '1mb'
  ***REMOVED***));

  // Fetch original replies data
  // @example: /forum/replies/246282
  app.get('/forum/replies/:id', repliesListRequestHandler);
  // Fetch original bid data
  // @example: /bids/246282
  app.get('/bids/:id/', bidItemsRequestHandler);
  // Fetch original bid data
  // @example /bids/246282/One02
  app.get('/bids/:id/:item', bidItemsRequestHandler);
  // Fetch hentaiverse equipment info
  // @example /hv/equip/https://hentaiverse.org/equip/268468677/df59bf55b2
  app.get('/hv/equip/:link');

  app.listen(port, () => {
    log.info(`Auto Pony listening at http://localhost:${port***REMOVED***`);
  ***REMOVED***);
***REMOVED***)();
