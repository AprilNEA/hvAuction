import got from 'got';
import FormData from 'form-data';

import express from 'express';
import { getPage ***REMOVED*** from './util/network';
import { ipsPostEncoder ***REMOVED*** from './util/encode';

export async function editPost(req: express.Request, res: express.Response): Promise<void> {
  if (
    req.params
    && req.params.forum && typeof req.params.forum === 'string'
    && req.params.id && typeof req.params.id === 'string'
    && req.params.postId && typeof req.params.postId === 'string'
    && (
      req.params.content && typeof req.params.content !== 'undefined'
      || req.body && req.body.content && typeof req.body.content !== 'undefined'
    )
  ) {
    if (process.env.ipb_member_id && process.env.ipb_pass_hash) {
      const pageHtml = await getPage(`https://forums.e-hentai.org/index.php?showtopic=${req.params.id***REMOVED***`, {
        headers: {
          cookie: `ipb_member_id=${process.env.ipb_member_id***REMOVED***; ipb_pass_hash=${process.env.ipb_pass_hash***REMOVED***`
        ***REMOVED***
      ***REMOVED***);

      if (pageHtml) {
        const md5CheckMatches = pageHtml.match(/ipb_md5_check\s+=\s"([\w\W]+?)";/);

        if (md5CheckMatches) {
          const md5check = md5CheckMatches[1];

          const content = (req.body.content && typeof req.body.content !== 'undefined') ? req.body.content : decodeURIComponent(req.params.content);

          const formData = new FormData();
          formData.append('md5check', md5check);
          formData.append('t', req.params.id);
          formData.append('f', req.params.forum);
          formData.append('p', req.params.postId);
          formData.append('act', 'xmlout'); // Fixed Value
          formData.append('do', 'post-edit-save'); // Fixed Value
          formData.append('std_used', '1'); // Fixed Value
          formData.append('Post', ipsPostEncoder(content)); // Fixed Value

          const { statusCode ***REMOVED*** = await got.post(`https://forums.e-hentai.org/index.php?s=&act=xmlout&do=post-edit-save&p=${req.params.postId***REMOVED***&t=${req.params.id***REMOVED***&f=${req.params.forum***REMOVED***`, {
            headers: {
              cookie: `ipb_member_id=${process.env.ipb_member_id***REMOVED***; ipb_pass_hash=${process.env.ipb_pass_hash***REMOVED***`
            ***REMOVED***,
            body: formData
          ***REMOVED***);

          if (statusCode < 400) {
            res.status(200).json({
              code: 0,
              msg: 'Post edit submitted successfully!',
              data: null
            ***REMOVED***).end();

            return;
          ***REMOVED***
        ***REMOVED***

        res.status(400).json({
          code: 1,
          msg: 'Can\'t connect to E-Hentai Forums!',
          data: null
        ***REMOVED***).end();

        return;
      ***REMOVED***

      res.status(200).json({***REMOVED***).end();
      return;
    ***REMOVED***

    res.status(400).json({
      code: 1,
      msg: 'You have to configure e-h account crendential first!',
      data: null
    ***REMOVED***).end();

    return;
  ***REMOVED***

  res.status(401).json({
    code: 1,
    msg: 'Missing or invalid parameters!',
    data: null
  ***REMOVED***).end();
***REMOVED***
