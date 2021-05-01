#!/usr/bin/python
# -*- coding: UTF-8 -*-
# @author: sukeycz
# @license:
# @contact: sukeycz0@gmail.com
# @software: PyCharm
# @project : hvAuction
# @file: test_api.py
# @time: 2021/5/1 19:25
# @desc:
import requests
SERVER ='http://hk.sukeycz.com:3001'

def mail_list():
    url = f'{SERVER}/hv/mooglemail/list'
    mid_list = requests.get(url).json()['data']
    for mid in mid_list:
        mid_out = requests.get(f"{SERVER}/hv/mooglemail/mail/{mid}").json()
        if mid_out['code'] == 0 and mid_out['msg'] == 'OK':
            pass
        else:
            return 0
mail_list()

