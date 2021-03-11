import { getPage ***REMOVED*** from './util/network';
import { parseEquipmentFromDocument ***REMOVED*** from './lib/equip/parser';
import hexoLogger from 'hexo-log';
import Cache from 'node-cache';

import express from 'express';

const log = hexoLogger();
const cache = new Cache({
  stdTTL: 43200
***REMOVED***);

export async function fetchEquipmentInfo(req: express.Request, res: express.Response): Promise<void> {
  if (req.query && req.query.url && typeof req.query.url === 'string') {
    try {
      if (process.env.ipb_member_id && process.env.ipb_pass_hash) {
        if (cache.has(req.query.url)) {
          res.status(200).json({
            code: 0,
            msg: '',
            data: cache.get(req.query.url)
          ***REMOVED***).end();

          return;
        ***REMOVED***
        const html = await getPage(req.query.url, {
          headers: {
            cookie: `ipb_member_id=${process.env.ipb_member_id***REMOVED***; ipb_pass_hash=${process.env.ipb_pass_hash***REMOVED***`
          ***REMOVED***
        ***REMOVED***);
        if (html) {
          const data = parseEquipmentFromDocument(html);
          cache.set(req.query.url, data);

          res.status(200).json({
            code: 0,
            msg: '',
            data
          ***REMOVED***).end();

          return;
        ***REMOVED***

        res.status(400).json({
          code: 1,
          msg: 'Error connecting and fetching provided "url"',
          data: null
        ***REMOVED***).end();

        return;
      ***REMOVED***

      res.status(400).json({
        code: 1,
        msg: 'You have to configure e-h account crendential first!',
        data: null
      ***REMOVED***).end();
    ***REMOVED*** catch (e) {
      res.status(401).send({
        code: 1,
        msg: 'Something went wrong when fetching & parse replies',
        data: null
      ***REMOVED***).end();

      log.error(e);
    ***REMOVED***
    return;
  ***REMOVED***

  res.status(404).end();
***REMOVED***
