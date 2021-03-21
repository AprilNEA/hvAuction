import express from 'express';

export function requestCredential(req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (process.env.ipb_member_id && process.env.ipb_pass_hash) {
    next();
  ***REMOVED*** else {
    res.status(400).json({
      code: 1,
      msg: 'You have to configure e-h account crendential first!',
      data: null
    ***REMOVED***).end();
  ***REMOVED***
***REMOVED***
