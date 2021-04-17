import { getPage } from '../../util/network';
import cheerio from 'cheerio';
import hexoLogger from 'hexo-log';

const log = hexoLogger();

export async function parseMoogleMailList(isIsekai = false): Promise<string[]> {
  const url = isIsekai ? 'https://hentaiverse.org/isekai/?s=Bazaar&ss=mm&filter' : 'https://hentaiverse.org/?s=Bazaar&ss=mm&filter';
  const html = await getPage(url, {
    headers: {
      cookie: `ipb_member_id=${process.env.ipb_member_id}; ipb_pass_hash=${process.env.ipb_pass_hash}`
    }
  });

  if (html) {
    const $ = cheerio.load(html);

    if ($('#mmail_nnm').length > 0) {
      log.info('[MoogleMail]', 'No new mooglemail found');
      return [];
    }

    const results: string[] = [];

    const $mooglemailList = $('#mmail_list tr');

    $mooglemailList.each((i, el) => {
      const onClick = $(el).attr('onclick');

      if (onClick) {
        const url = onClick.substring(0, onClick.length - 1).replace('document.location=\'', '');

        try {
          const mid = new URL(url).searchParams.get('mid');
          if (mid) {
            results.push(mid);
          }
        } catch (e) {
          log.error('[MoogleMail]', 'Fail to parse URL:', url);
        }
      }
    });

    return results;
  }

  return [];
}

export function parseMoogleMail(isIsekai = false, mid: string) {

};
