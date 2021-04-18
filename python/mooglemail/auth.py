import requests
from time import time
from configparser import ConfigParser
config = ConfigParser()
info = config.read('config.ini',encoding='UTF-8')
EHLOGINURL = "https://forums.e-hentai.org/index.php?act=Login&CODE=01"
EHCREDENTIALS = {
    "UserName": info['Account']['account'],
    "PassWord": info['Account']['password'],
    "CookieDate": 1
}
HVLOGINURL = "http://alt.hentaiverse.org/login?ipb_member_id=#####&ipb_pass_hash=########"

session = requests.Session()
##身份验证函数
#these are the functions for authenticating.
#you need to put in the correct details
#(and to get the HVLOGINURL, you will need to use the network tab in your browser to get the URL that it redirects to after going through the forum login)
##
def eh_auth():
    global session
    session.post(EHLOGINURL, data=EHCREDENTIALS)

def eh_auth_check():
    global session
    if session.cookies:
        for c in session.cookies:
            if (c.domain == '.e-hentai.org'
                and c.name == '__cfduid'
                and c.expires > time()):
                return True
    return False

def hv_auth():
    global session
    session.get(HVLOGINURL)

def hv_auth_check():
    global session
    if session.cookies:
        for c in session.cookies:
            if (c.domain == '.hentaiverse.org'
                and c.name == '__cfduid'
                and c.expires > time()):
                return True
    return False

hv_auth()
print(session)



