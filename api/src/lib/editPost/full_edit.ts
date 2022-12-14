import got from 'got';
import FormData from 'form-data';

import type express from 'express';
import cheerio from 'cheerio';

export async function fullEditPost(req: express.Request, res: express.Response): Promise<void> {
  if (
    req.params
    && req.params.forum && typeof req.params.forum === 'string'
    && req.params.id && typeof req.params.id === 'string'
    && req.params.postId && typeof req.params.postId === 'string'
    && req.body
    && typeof req.body.title !== 'undefined'
    && typeof req.body.content !== 'undefined'
  ) {
    const { body: pageHtml } = await got.get(`https://forums.e-hentai.org/index.php?act=post&do=edit_post&f=${req.params.forum}&t=${req.params.id}&p=${req.params.postId}`, {
      headers: {
        cookie: `ipb_member_id=${process.env.ipb_member_id}; ipb_pass_hash=${process.env.ipb_pass_hash}`
      }
    });

    const formData = new FormData();

    const $ = cheerio.load(pageHtml);
    $('#postingform input[type="hidden"]').each((i, el) => {
      const name = $(el).attr('name');
      const value = $(el).attr('value');
      if (name && value) {
        formData.append(name, value);
      }
    });

    formData.append('TopicTitle', req.body.title);
    if (typeof req.body.description !== 'undefined') {
      formData.append('TopicDesc', req.body.description);
    } else {
      formData.append('TopicDesc', '');
    }
    formData.append('ffont', 0); // Fixed Value
    formData.append('fsize', 0); // Fixed Value
    formData.append('Post', req.body.content);
    formData.append('enableemo', 'yes'); // Fixed Value
    formData.append('enablesig', 'yes'); // Fixed Value
    formData.append('iconid', 0); // Fixed Value
    formData.append('dosubmit', 'Submit Modified Post'); // Fixed Value

    const { statusCode, body } = await got.post('https://forums.e-hentai.org/index.php?', {
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

    res.status(400).json({
      code: 1,
      msg: 'Can\'t connect to E-Hentai Forums!',
      data: null
    }).end();

    return;
  }

  res.status(401).json({
    code: 1,
    msg: 'Missing or invalid parameters!',
    data: null
  }).end();
}
