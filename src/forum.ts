import got from 'got';
import * as cheerio from 'cheerio';
import { parse as parseBid ***REMOVED*** from './lib/tokenizer';
import { Bid, Forum ***REMOVED*** from './@types/thread';
import hexoLogger from 'hexo-log';
import { parsePrice ***REMOVED*** from './util/price';
import Cache from 'node-cache';
import express from 'express';

const log = hexoLogger();
const forumsRequestCache = new Cache({
  stdTTL: 60
***REMOVED***);

async function getPage(url: string): Promise<string | undefined> {
  if (forumsRequestCache.has(url)) {
    log.info(`Reading Page from Cache: ${url***REMOVED***`);
    return forumsRequestCache.get(url);
  ***REMOVED***

  log.info(`Fetching Page: ${url***REMOVED***`);

  const { body ***REMOVED*** = await got(url, {
    retry: { limit: 2 ***REMOVED***,
    headers: {
      'User-Agent': 'Mozilla/5.0 New Auction'
    ***REMOVED***
  ***REMOVED***);

  forumsRequestCache.set(url, body);

  return body;
***REMOVED***

function parsePages(html: string, threadId: number): {
  posts: Forum.Reply[],
  nextPage: string | undefined
***REMOVED*** {
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
        const postLink = `https://forums.e-hentai.org/index.php?showtopic=${threadId***REMOVED***&view=findpost&p=${$id***REMOVED***`;

        results.push({
          postId,
          postLink,
          username,
          date,
          timestamp,
          content,
          isEdited,
          bid
        ***REMOVED***);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***);

  return {
    posts: results,
    nextPage: $('[title="Next page"]').attr('href')
  ***REMOVED***;
***REMOVED***

async function getThreadReplyWalker(url: string, threadId: number, results: Forum.Reply[] = []): Promise<Forum.Reply[]> {
  const html = await getPage(url);

  if (html) {
    const { posts, nextPage ***REMOVED*** = parsePages(html, threadId);
    results.push(...posts);

    if (nextPage) {
      await getThreadReplyWalker(nextPage, threadId, results);
    ***REMOVED***
  ***REMOVED***

  return results;
***REMOVED***

async function getThreadReply(threadId: number): Promise<Forum.Reply[]> {
  const results: Forum.Reply[] = [];

  await getThreadReplyWalker(`https://forums.e-hentai.org/index.php?showtopic=${threadId***REMOVED***`, threadId, results);

  return results;
***REMOVED***

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
        ***REMOVED***).end();

        return;
      ***REMOVED*** catch (e) {
        res.status(401).send({
          code: 1,
          msg: 'Something went wrong when fetching & parse replies',
          data: null
        ***REMOVED***).end();
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

  res.status(401).json({
    code: 1,
    msg: 'Missing :id parameter, or :id paramater is invalid',
    data: null
  ***REMOVED***).end();
***REMOVED***

export async function bidItemsRequestHandler(req: express.Request, res: express.Response): Promise<void> {
  if (req.params && req.params.id && typeof req.params.id === 'string') {
    const num = Number(req.params.id);
    if (!isNaN(num)) {
      const threadId = num;

      const bidMap: Bid.BidsMap = {***REMOVED***;

      const posts = await getThreadReply(threadId);
      posts.forEach((post) => {
        if (post.postId !== '#1' && post.postId !== '#2') {
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
            ***REMOVED***);
          ***REMOVED***);
        ***REMOVED***
      ***REMOVED***);

      if (req.params.item && typeof req.params.item === 'string') {
        const item = req.params.item.toLowerCase();

        if (bidMap[item]) {
          res.status(200).json({
            code: 0,
            msg: '',
            data: bidMap[item]
          ***REMOVED***).end();

          return;
        ***REMOVED***

        res.status(200).json({
          code: 0,
          msg: `There is no bid related with ${item***REMOVED***.`,
          data: []
        ***REMOVED***).end();

        return;
      ***REMOVED***

      res.status(200).json({
        code: 0,
        msg: '',
        data: bidMap
      ***REMOVED***).end();

      return;
    ***REMOVED***
  ***REMOVED***

  res.status(401).json({
    code: 1,
    msg: 'Missing :id parameter, or :id paramater is invalid',
    data: null
  ***REMOVED***).end();
***REMOVED***
