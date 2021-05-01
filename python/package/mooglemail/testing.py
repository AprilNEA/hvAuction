import requests
import re
import csv
from bs4 import BeautifulSoup as bs
from configparser import ConfigParser

def accept_mail(mid):
    url = 'http://alt.hentaiverse.org/isekai/?s=Bazaar&ss=mm&filter=inbox&mid=' + mid
    resp = session.get(url)
    resp = bs(resp.text, 'html.parser')
    assert resp.find(id='mailform')
    # mm_token = resp.find('input', {'name': 'mmtoken'}).get('value')
    sender = resp.find_all('input')[4].get('value')
    info = resp.find_all("script")[3]
    attach_list = resp.find(id='mmail_attachlist')
    # print(attach_list)
    equip_key = re.findall(re.compile(r'\{([^{}]*?)\}', re.S), str(info))
    if attach_list.find('div', onmouseout="equips.unset()") is not None:
        id = attach_list.find('div', onmouseout="equips.unset()").get('onmouseover')[10:]
        id = eval(id)[0]
        equip_key = eval("{" + equip_key[0] + "}")
        equip_url = f'http://alt.hentaiverse.org/isekai/equip/' + str(id) + '/' + equip_key['k']
        code = 1
    else:
        # id = attach_list.find('div', onmouseout="common.hide_popup_box()").get('onmouseover')[21:].replace(",this", "");
        # print(id)
        # equip_url = eval(id)[4]
        code = 0
        equip_url = attach_list.find('div', onmouseout="common.hide_popup_box()").text
    assert attach_list
    return attach_list, sender, equip_url, code


proxies = {
    'http': 'http://127.0.0.1:7890',
    'https': 'http://127.0.0.1:7890',
}
config = ConfigParser()
config.read('config.ini', encoding='UTF-8')
EHLOGINURL = "https://forums.e-hentai.org/index.php?act=Login&CODE=01"
EHCREDENTIALS = {
    "UserName": config['Account']['account'],
    "PassWord": config['Account']['password'],
    "CookieDate": 1
}
HVLOGINURL = "http://alt.hentaiverse.org/isekai/login?ipb_member_id=#####&ipb_pass_hash=########"
session = requests.Session()
session.post(EHLOGINURL, data=EHCREDENTIALS, proxies=proxies)
d = []
for i in 0, 1:
    session.get(HVLOGINURL, proxies=proxies)
    url = f'http://alt.hentaiverse.org/isekai/?s=Bazaar&ss=mm&filter=inbox&page={i}'
    resp = session.get(url, proxies=proxies)
    resp = session.get(url, proxies=proxies)
    resp = bs(resp.text, 'html.parser')
    assert resp.find(id='mmail_list')  # page loaded

    new_mails = resp.find_all('tr')
    for mail in new_mails[1:]:
        r = re.search('mid=(\d+)', str(mail))
        a, b, c, code = accept_mail(r.group(1))
        print(b, c, code)
        j = [b, c, code]
        d.append(j)
csv_writer = csv.writer(open(r'D:\Github\hvAuction\python\equip_info\4.csv', 'w', encoding='utf-8-sig', newline=''))
for j in d:
    csv_writer.writerow(j)
