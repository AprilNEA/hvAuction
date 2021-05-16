import re
from bs4 import BeautifulSoup as bs


class HVInterface(object):
    def __init__(self, session):
        self.session = session

    #this is the very basic first part: it gets the mail inbox, then performs the 'accept_mail' package for each mail ID found
    #获取邮件
    def fetch_mail(self):
        url = 'http://alt.hentaiverse.org/?s=Bazaar&ss=mm&filter=inbox'
        resp = self.session.get(url)
        resp = bs(resp.text, 'html.parser')
        assert resp.find(id='mmail_list') # page loaded

        if resp.find(id='mmail_nnm'):
            return # no new mail

        new_mails = resp.find_all('tr')
        for mail in new_mails[1:]:
            r = re.search('mid=(\d+)', str(mail) )
            self.accept_mail(r.group(1))

    #this part first just gets the mail and checks that it has attachments in it (if there are no attachments, just reading it is enough to clear it from your inbox)
    def accept_mail(self, mid):
        url = 'http://alt.hentaiverse.org/?s=Bazaar&ss=mm&filter=inbox&mid=' + mid
        resp = self.session.get(url)
        resp = bs(resp.text, 'html.parser')
        assert resp.find(id='mailform')
        mm_token = resp.find('input', {'name': 'mmtoken'}).get('value')
        sender = resp.find_all('input')[4].get('value')
        attach_list = resp.find(id='mmail_attachlist')
        assert attach_list

        items = re.findall(
            ">(\d+)x ([\-\' a-zA-Z0-9]+)</div>",
            str(attach_list))
        self.remove_attachments(url, mm_token)  # We'll cover this later

    def remove_attachments(self, url, mm_token):
        post_data = {
            'action': 'attach_remove',
            'action_value': 0,
            'mmtoken': mm_token}
        resp = self.session.post(url, data=post_data)
        resp = bs(resp.text, 'html.parser')
        assert resp.find(id='mailform')
        assert not resp.find('img', onclick='mooglemail.remove_attachment(0)')
        return True

    def reject_mail(self, url, mm_token):
        post_data = {
            'action': 'return_message',
            'action_value': 0,
            'mmtoken': mm_token}
        resp = self.session.post(url, data=post_data)
        resp = bs(resp.text, 'html.parser')
        assert resp.find(id='mailform')
        assert resp.find('input', value='MoogleMail')
        return True

    def recall_sent_order(self, mid):
        # Cancels sales associated with an MID
        url = 'http://alt.hentaiverse.org/?s=Bazaar&ss=mm&filter=sent&mid=' + str(mid)
        resp = self.session.get(url)
        resp = bs(resp.text, 'html.parser')
        assert resp.find('img', onclick='mooglemail.return_mail()')

        mm_token = resp.find('input', {'name': 'mmtoken'}).get('value')

        # Recall the mail
        resp = self.session.post(url, data={
            'action': 'return_message',
            'action_value': 0,
            'mmtoken': mm_token})
        resp = bs(resp.text, 'html.parser')
        assert resp.find('img', onclick='mooglemail.remove_attachment(0)')

    def attach_items(self, mm_token, item_id, quantity):
        new_mail_url = 'http://alt.hentaiverse.org/?s=Bazaar&ss=mm&filter=new'
        resp = self.session.post(new_mail_url, data={
            'action': 'attach_add',
            'action_value': 0,
            'select_item': item_id,
            'select_count': quantity,
            'mmtoken': mm_token,
            'select_pane': 'item'})
        resp = bs(resp.text, 'html.parser')
        assert resp.find('img', onclick='mooglemail.remove_attachment(0)')

    def attach_items(self, mm_token, item_id, quantity):
        new_mail_url = 'http://alt.hentaiverse.org/?s=Bazaar&ss=mm&filter=new'
        resp = self.session.post(new_mail_url, data={
            'action': 'attach_add',
            'action_value': 0,
            'select_item': item_id,
            'select_count': quantity,
            'mmtoken': mm_token,
            'select_pane': 'item'})
        resp = bs(resp.text, 'html.parser')
        assert resp.find('img', onclick='mooglemail.remove_attachment(0)')

    def set_cod(self, mm_token, cod_amount):
        if cod_amount > 0:
            cod_amount = max(cod_amount, 10)  # minimum CoD is 10c, you wont need this

        new_mail_url = 'http://alt.hentaiverse.org/?s=Bazaar&ss=mm&filter=new'
        resp = self.session.post(new_mail_url, data={
            'action': 'attach_cod',
            'action_value': cod_amount,
            'mmtoken': mm_token})
        resp = bs(resp.text, 'html.parser')

        find_string = 'Requested Payment on Delivery: ' \
                      + f"{cod_amount:,}" \
                      + ' credits'
        assert resp.find('div', string=find_string)
