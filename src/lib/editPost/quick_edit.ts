import got from 'got';
import FormData from 'form-data';

import express from 'express';
import { getPage } from '../../util/network';
import { ipsPostEncoder } from '../../util/encode';

export async function quickEditPost(req: express.Request, res: express.Response): Promise<void> {
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
    const pageHtml = await getPage(`https://forums.e-hentai.org/index.php?showtopic=${req.params.id}`, {
      headers: {
        cookie: `ipb_member_id=${process.env.ipb_member_id}; ipb_pass_hash=${process.env.ipb_pass_hash}`
      }
    });

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

        const { statusCode, body } = await got.post(`https://forums.e-hentai.org/index.php?s=&act=xmlout&do=post-edit-save&p=${req.params.postId}&t=${req.params.id}&f=${req.params.forum}`, {
          headers: {
            cookie: `ipb_member_id=${process.env.ipb_member_id}; ipb_pass_hash=${process.env.ipb_pass_hash}`
          },
          body: formData
        });

        if (statusCode < 400) {
          res.status(200).json({
            code: 0,
            msg: 'Post edit submitted successfully!',
            data: body
          }).end();

          return;
        }
      }

      res.status(400).json({
        code: 1,
        msg: 'Can\'t connect to E-Hentai Forums!',
        data: null
      }).end();

      return;
    }

    res.status(200).json({}).end();
    return;
  }

  res.status(401).json({
    code: 1,
    msg: 'Missing or invalid parameters!',
    data: null
  }).end();
}
