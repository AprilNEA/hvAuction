import express from 'express';
import { parseMoogleMailList } from './lib/mooglemail';

export async function getMoogleMailList(req: express.Request, res: express.Response): Promise<void> {
  const isIsekai = req.query && typeof req.query.isekai !== 'undefined';
  const data = isIsekai ? await parseMoogleMailList(true) : await parseMoogleMailList(false);

  res.status(200).json({
    code: 0,
    msg: '',
    data
  }).end();
}
