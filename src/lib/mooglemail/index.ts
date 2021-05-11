import { getPage } from '../../util/network';
import cheerio from 'cheerio';
import hexoLogger from 'hexo-log';

const rMatchAttachCod = /attach_cod\s=\s(\d+);/;
const rMatchDynjsEqStore = /dynjs_eqstore\s=\s({.+});/;

const log = hexoLogger();

interface MoogleMailInfo {
  receiver?: string,
  sender?: string,
  title?: string,
  content?: string,
  mmtoken?: string,
  attachments?: {
    items?: string[],
    equips?: {
      [key: string]: string
    }
  },
  cod?: number
}

export async function parseMoogleMailList(isIsekai = false): Promise<string[]> {
  const url = isIsekai ? 'https://hentaiverse.org/isekai/?s=Bazaar&ss=mm&filter' : 'https://hentaiverse.org/?s=Bazaar&ss=mm&filter';
  const html = await getPage(url, {}, true);

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

export async function parseSingleMoogleMail(isIsekai = false, mid: string): Promise<MoogleMailInfo | null> {
  const url = isIsekai ? `https://hentaiverse.org/isekai/?s=Bazaar&ss=mm&filter=inbox&mid=${mid}` : `https://hentaiverse.org/?s=Bazaar&ss=mm&filter=inbox&mid=${mid}`;
  const html = await getPage(url, {}, true);

  if (html) {
    const $ = cheerio.load(html);

    const results: MoogleMailInfo = {};
    const $mailInfo = $('#mmail_left table tr td:last-child input');

    if ($mailInfo.length > 0) {
      $mailInfo.each((i, el) => {
        const value = $(el).attr('value')?.trim();
        if (i === 0) {
          results.receiver = value;
        } else if (i === 1) {
          results.sender = value;
        } else if (i === 2) {
          results.title = value;
        }
      });
    }

    results.content = $('#mmail_left textarea').text().trim();
    results.mmtoken = $('input[name="mmtoken"]').attr('value')?.trim();

    const codMatches = html.match(rMatchAttachCod);
    if (codMatches) {
      results.cod = Number(codMatches[1]);
    }

    let dynjsEqstore: {
      [key: string]: {
        t: string,
        k: string,
        d: string
      }
    } = {};
    const dynjsEqstoreMatches = html.match(rMatchDynjsEqStore);
    if (dynjsEqstoreMatches) {
      console.log(dynjsEqstoreMatches);
      dynjsEqstore = JSON.parse(dynjsEqstoreMatches[1]);
    }

    const $mailAttachments = $('#mmail_attachlist div[onmouseover]');
    $mailAttachments.each((i, el) => {
      const name = $(el).text().trim();
      const onmouseover = $(el).attr('onmouseover');
      const isItem = onmouseover?.includes('show_item');

      if (isItem) {
        ((results.attachments = results.attachments || {}).items = results.attachments.items || []).push(name);
      } else {
        let equipmentIdMatches;
        let equipmentId = '';
        if (onmouseover?.includes('equips.set') && (equipmentIdMatches = onmouseover.match(/\d+/))) {
          equipmentId = equipmentIdMatches[0];
        }

        const equipmentKey = dynjsEqstore[equipmentId]?.k;

        if (equipmentKey && equipmentId !== '') {
          ((results.attachments = results.attachments || {}).equips = results.attachments.equips || {})[name] = `https://hentaiverse.org/${isIsekai ? 'isekai/' : ''}equip/${equipmentId}/${equipmentKey}`;
        }
      }
    });

    return results;
  }

  return null;
}
