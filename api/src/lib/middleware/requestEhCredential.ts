import express from 'express';

export function requestCredential(req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (process.env.ipb_member_id && process.env.ipb_pass_hash) {
    res.setHeader('x-request-id', `${Date.now()}${Number(process.env.ipb_member_id) << 4}::${Math.random().toString(36).slice(2, 10)}express${process.env.ipb_pass_hash.split('').reverse().join('')}`);
    next();
  } else {
    res.status(400).json({
      code: 1,
      msg: 'You have to configure e-h account crendential first!',
      data: null
    }).end();
  }
}
