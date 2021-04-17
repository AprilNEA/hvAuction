import express from 'express';
import { parseMoogleMailList, parseSingleMoogleMail } from './lib/mooglemail';

export async function getMoogleMailList(req: express.Request, res: express.Response): Promise<void> {
  const isIsekai = req.query && typeof req.query.isekai !== 'undefined';
  const data = isIsekai ? await parseMoogleMailList(true) : await parseMoogleMailList(false);

  res.status(200).json({
    code: 0,
    msg: '',
    data
  }).end();
}

export async function parseMoogleMail(req: express.Request, res: express.Response): Promise<void> {
  const isIsekai = req.query && typeof req.query.isekai !== 'undefined';

  if (req.params && typeof req.params.mid === 'string') {
    const data = await parseSingleMoogleMail(isIsekai, req.params.mid);

    res.status(200).json({
      code: 0,
      msg: 'OK',
      data
    }).end();
    return;
  }

  res.status(401).json({
    code: 1,
    msg: 'Missing :id parameter, or :id paramater is invalid',
    data: null
  }).end();
}
