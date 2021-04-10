import * as cheerio from 'cheerio';
import { parse as parseBid } from './lib/bid/tokenizer';
import { Bid, Forum } from './@types/thread';
import { parsePrice } from './util/price';
import { getPage } from './util/network';

import express from 'express';

function parsePages(html: string, threadId: number): {
  posts: Forum.Reply[],
  nextPage: string | undefined
} {
  const results: Forum.Reply[] = [];

  const $ = cheerio.load(html);

  $('.page div.borderwrap table').each((i, el) => {
    const postId = $('.subtitle span.postdetails', el).text().trim().replace(/\s+/, ' ').replace('Post ', '');
    const date = $('.subtitle span:not(.postdetails)', el).text().trim();

    if (postId.length !== 0 && date.length !== 0) {
      const username = $('.bigusername', el).text().trim();
      const $contentEl = $('.postcolor', el);
      const $id = $contentEl.attr('id')?.replace('post-', '');
      const content = $contentEl.html()?.replace(/<br>/g, '\n');

      if (username.length !== 0 && content && content.length !== 0 && $id) {
        const timestamp = new Date(date).getTime();
        const bid = parseBid(content);
        const isEdited = content.includes('This post has been edited by');
        const postLink = `https://forums.e-hentai.org/index.php?showtopic=${threadId}&view=findpost&p=${$id}`;

        results.push({
          postId,
          postLink,
          $id,
          username,
          date,
          timestamp,
          content,
          isEdited,
          bid
        });
      }
    }
  });

  return {
    posts: results,
    nextPage: $('[title="Next page"]').attr('href')
  };
}

async function getThreadReplyWalker(url: string, threadId: number, results: Forum.Reply[] = []): Promise<Forum.Reply[]> {
  const html = await getPage(url);

  if (html) {
    const { posts, nextPage } = parsePages(html, threadId);
    results.push(...posts);

    if (nextPage) {
      await getThreadReplyWalker(nextPage, threadId, results);
    }
  }

  return results;
}

async function getThreadReply(threadId: number): Promise<Forum.Reply[]> {
  const results: Forum.Reply[] = [];

  await getThreadReplyWalker(`https://forums.e-hentai.org/index.php?showtopic=${threadId}`, threadId, results);

  return results;
}

export async function repliesListRequestHandler(req: express.Request, res: express.Response): Promise<void> {
  if (req.params && req.params.id && typeof req.params.id === 'string') {
    const num = Number(req.params.id);
    if (!isNaN(num)) {
      const threadId = num;

      try {
        const posts = await getThreadReply(threadId);

        res.status(200).json({
          code: 0,
          msg: '',
          data: posts
        }).end();

        return;
      } catch (e) {
        res.status(401).send({
          code: 1,
          msg: 'Something went wrong when fetching & parse replies',
          data: null
        }).end();
      }
    }
  }

  res.status(401).json({
    code: 1,
    msg: 'Missing :id parameter, or :id paramater is invalid',
    data: null
  }).end();
}

export async function bidItemsRequestHandler(req: express.Request, res: express.Response): Promise<void> {
  if (req.params && req.params.id && typeof req.params.id === 'string') {
    const num = Number(req.params.id);
    if (!isNaN(num)) {
      const threadId = num;

      const bidMap: Bid.BidsMap = {};

      const posts = await getThreadReply(threadId);
      posts.forEach((post) => {
        Object.keys(post.bid).forEach(item => {
          const bidPrice = post.bid[item];

          (bidMap[item] = bidMap[item] || []).push({
            postId: post.postId,
            postLink: post.postLink,
            username: post.username,
            isEdited: post.isEdited,
            date: post.date,
            timestamp: post.timestamp,
            price: bidPrice === 'start' || bidPrice === 'cancel' ? bidPrice : parsePrice(bidPrice || '0')
          });
        });
      });

      if (req.params.item && typeof req.params.item === 'string') {
        const item = req.params.item.toLowerCase();

        if (bidMap[item]) {
          res.status(200).json({
            code: 0,
            msg: '',
            data: bidMap[item]
          }).end();

          return;
        }

        res.status(200).json({
          code: 0,
          msg: `There is no bid related with ${item}.`,
          data: []
        }).end();

        return;
      }

      res.status(200).json({
        code: 0,
        msg: '',
        data: bidMap
      }).end();

      return;
    }
  }

  res.status(401).json({
    code: 1,
    msg: 'Missing :id parameter, or :id paramater is invalid',
    data: null
  }).end();
}
