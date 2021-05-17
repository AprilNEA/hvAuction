import requests
import json
from bs4 import BeautifulSoup as bs
config = json.load(open('python/config.json'))

HVLOGINURL = f"http://alt.hentaiverse.org/isekai/login?ipb_member_id={config['ipb_member_id']}&ipb_pass_hash={config['ipb_pass_hash']}"
session = requests.Session()
session.get(HVLOGINURL)

def get_mmtoken(mid):
    url = 'http://alt.hentaiverse.org/?s=Bazaar&ss=mm&filter=inbox&mid=' + mid
    resp = session.get(url)
    resp = bs(resp.text, 'html.parser')
    assert resp.find(id='mailform')
    mm_token = resp.find('input', {'name': 'mmtoken'}).get('value')
    # sender = resp.find_all('input')[4].get('value')
    # attach_list = resp.find(id='mmail_attachlist')
    # assert attach_list
    return mm_token
    # accept(url, mm_token)  # We'll cover this later

def accept(url, mm_token):
    post_data = {
        'action': 'attach_remove',
        'action_value': 0,
        'mmtoken': mm_token}
    resp = session.post(url, data=post_data)
    resp = bs(resp.text, 'html.parser')
    assert resp.find(id='mailform')
    if not resp.find('img', onclick='mooglemail.remove_attachment(0)'):
        return True
    else:
        return False

def reject(mid, mm_token=0):
    url = f'http://alt.hentaiverse.org/isekai/?s=Bazaar&ss=mm&filter=inbox&mid={mid}'
    if mm_token == 0:
        get_mmtoken(mid)
    post_data = {
        'action': 'return_message',
        'action_value': 0,
        'mmtoken': mm_token}
    resp = session.post(url, data=post_data)
    resp = bs(resp.text, 'html.parser')
    assert resp.find(id='mailform')
    assert resp.find('input', value='MoogleMail')
    return True

def set_cod(mm_token, cod_amount):
    if cod_amount > 0:
        cod_amount = max(cod_amount, 10)  # minimum CoD is 10c, you wont need this
    new_mail_url = 'http://alt.hentaiverse.org/?s=Bazaar&ss=mm&filter=new'
    resp = session.post(new_mail_url, data={
        'action': 'attach_cod',
        'action_value': cod_amount,
        'mmtoken': mm_token})
    resp = bs(resp.text, 'html.parser')
    find_string = 'Requested Payment on Delivery: ' \
                  + f"{cod_amount:,}" \
                  + ' credits'
    assert resp.find('div', string=find_string)
    return True

def attach_items(self, mm_token, item_id, quantity):
    new_mail_url = 'http://alt.hentaiverse.org/isekai/?s=Bazaar&ss=mm&filter=new'
    resp = self.session.post(new_mail_url, data={
        'action': 'attach_add',
        'action_value': 0,
        'select_item': item_id,
        'select_count': quantity,
        'mmtoken': mm_token,
        'select_pane': 'item'})
    resp = bs(resp.text, 'html.parser')
    assert resp.find('img', onclick='mooglemail.remove_attachment(0)')
    return True

def attach_credits(self, mm_token, quantity):
    new_mail_url = 'http://alt.hentaiverse.org/isekai/?s=Bazaar&ss=mm&filter=new'
    resp = self.session.post(new_mail_url, data={
        'action': 'attach_add',
        'action_value': 0,
        'select_item': 0,
        'select_count': quantity,
        'mmtoken': mm_token,
        'select_pane': 'credits'})
    resp = bs(resp.text, 'html.parser')
    assert resp.find('img', onclick='mooglemail.remove_attachment(0)')
    return True

def unlock_equips(self, uid,eid, token):
    new_mail_url = 'http://alt.hentaiverse.org/isekai/?s=Bazaar&ss=mm&filter=new'
    resp = self.session.post(new_mail_url, data={
        'uid': uid,
        'eid': eid,
        'lock': 0,
        'method': 'lockequip',
        'select_count': 1,
        'token': token,
        'type': 'simple'})
    resp = bs(resp.text, 'html.parser')
    assert resp.find('img', onclick='mooglemail.remove_attachment(0)')
    return True

def attach_equip(self, mm_token, eid):
    new_mail_url = 'http://alt.hentaiverse.org/isekai/?s=Bazaar&ss=mm&filter=new'
    resp = self.session.post(new_mail_url, data={
        'action': 'attach_add',
        'action_value': 0,
        'select_item': eid,
        'select_count': 1,
        'mmtoken': mm_token,
        'select_pane': 'equip'})
    resp = bs(resp.text, 'html.parser')
    assert resp.find('img', onclick='mooglemail.remove_attachment(0)')
    return True

def new(mm_receiver,mm_subject,mm_body):
    new_mail_url = 'http://alt.hentaiverse.org/?s=Bazaar&ss=mm&filter=new'
    resp = session.get(new_mail_url)
    resp = bs(resp.text, 'html.parser')
    assert resp.find(id='mailform')
    mm_token = resp.find('input', {'name': 'mmtoken'}).get('value')
    mm_receiver = '' # the user's name you want to send to
    mm_subject = '' # mail subject
    mm_body = '' # mail body
    resp = session.post(new_mail_url, data = {
        'message_to_name': mm_receiver,
        'message_subject': mm_subject,
        'message_body': mm_body,
        'action': 'send',
        'mmtoken': mm_token})
    resp = bs(resp.text, 'html.parser')
    if resp.find('div', string='Invalid or missing recipient, kupo!'): # name changes cause this mostly
        raise ValueError('Invalid or missing recipient.') # you should handle this
    assert resp.find('div', string='Your message has been sent.')
