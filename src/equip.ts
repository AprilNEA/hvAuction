import { getPage } from './util/network';
import { parseEquipmentFromDocument } from './lib/equip/parser';
import hexoLogger from 'hexo-log';

import express from 'express';

const log = hexoLogger();
const cache = new Map();

export async function fetchEquipmentInfo(req: express.Request, res: express.Response): Promise<void> {
  if (req.query && req.query.url && typeof req.query.url === 'string') {
    try {
      if (cache.has(req.query.url)) {
        res.status(200).json({
          code: 0,
          msg: '',
          data: cache.get(req.query.url)
        }).end();

        return;
      }
      const html = await getPage(req.query.url, {}, true);

      if (html) {
        const data = parseEquipmentFromDocument(html);
        cache.set(req.query.url, data);

        res.status(200).json({
          code: 0,
          msg: '',
          data
        }).end();

        return;
      }

      res.status(400).json({
        code: 1,
        msg: 'Error connecting and fetching provided "url"',
        data: null
      }).end();

      return;
    } catch (e) {
      res.status(401).send({
        code: 1,
        msg: 'Something went wrong when fetching & parse equipment',
        data: null
      }).end();

      log.error('[Equipment]', e);
    }
    return;
  }

  res.status(404).end();
}
