import dotenv from 'dotenv';
import express from 'express';
import hexoLogger from 'hexo-log';
import { bidItemsRequestHandler, repliesListRequestHandler } from './auction';
import { fetchEquipmentInfo } from './equip';
import { quickEditPost } from './thread';
import cors from 'cors';
import { requestCredential } from './lib/middleware/requestEhCredential';
import { fullEditPost } from './lib/editPost/full_edit';
import { getMoogleMailList, parseMoogleMail } from './mooglemail';

dotenv.config();

(async () => {
  const log = hexoLogger();

  const app = express();

  const { hv_api_port: hvApiPort } = process.env;
  const port = isNaN(Number(hvApiPort)) ? 3001 : Number(hvApiPort);

  app.use(express.json({
    limit: '2mb'
  }));
  app.use(cors());

  // Fetch original replies data
  // @example: /forum/replies/246282
  app.get('/forum/replies/:id', repliesListRequestHandler);

  // Edit a post
  // forum: Forum SubForum ID (Test Forum: 4, WTS: 77, ISK Trade: 90)
  // id: thread id
  // postId: $id from API "/forum/replies/:id"
  // content: uri encoded content
  app.get('/forum/edit/:forum/:id/:postId/:content', requestCredential, quickEditPost);
  app.post('/forum/edit/:forum/:id/:postId/', requestCredential, quickEditPost);
  app.post('/forum/full_edit/:forum/:id/:postId/', requestCredential, fullEditPost);

  // Fetch original bid data
  // @example: /bids/246282
  app.get('/bids/:id/', bidItemsRequestHandler);

  // Fetch original bid data
  // @example /bids/246282/One02
  app.get('/bids/:id/:item', bidItemsRequestHandler);

  // Fetch hentaiverse equipment info
  // @example /hv/equip/?url=https://hentaiverse.org/equip/268468677/df59bf55b2
  app.get('/hv/equip/*', requestCredential, fetchEquipmentInfo);

  // Fetch hentaiverse mooglemail list
  // @example /hv/mooglemail/list
  // @example /hv/mooglemail/list?isekai=1
  app.get('/hv/mooglemail/list*', requestCredential, getMoogleMailList);

  // Fetch hentaiverse mooglemail list
  // @example /hv/mooglemail/mail/1919810
  // @example /hv/mooglemail/mail/114514?isekai=1
  app.get('/hv/mooglemail/mail/:mid', requestCredential, parseMoogleMail);

  app.listen(port, () => {
    log.info('[Main]', `API Server listening at http://localhost:${port}`);
  });
})();
