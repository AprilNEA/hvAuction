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

from db import HVAPI

api = HVAPI(r'http://hk.sukeycz.com:3001')

aution_mail, not_auction_mail = api.mail_list()

print(aution_mail)
