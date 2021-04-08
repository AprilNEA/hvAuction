# -*- coding: utf-8 -*-
import json
***REMOVED***
import sqlite3
import urllib
from datetime import datetime
import time
from hvapi import HVAPI
from databasesq3 import DATABASE

api = HVAPI(r'http://hk.sukeycz.com:3001')
db_name = r'D:\Github\hvAuction\python\database\auction.db'


def price_conver_2(price):
    price = float(price)
    if price >= 1000000:
        price_2 = str(price / 1000000) + "m"
    if price >= 1000:
        price_2 = str(price / 1000) + "k"
    return price_2


table = 'ISK003'
conn = sqlite3.connect(db_name)
c = conn.cursor()
winner = 0
price = 0
cursor = c.execute(f"SELECT ID,SELLER,NAME,LINK,PRICE,WINNER from {table***REMOVED***")
seller = {***REMOVED***
buyer = {***REMOVED***
buyer_2 = {***REMOVED***
for row in cursor:
    if row[5] == None:
        print(f'货物{row[2]***REMOVED***应退回{row[1]***REMOVED***，链接是{row[3]***REMOVED***')
    else:
        if not row[1] in seller:
            seller[row[1]] = float(row[4])
        else:
            seller[row[1]] = float(seller[row[1]]) + float(row[4])
        if not row[5] in buyer or not row[5] in buyer_2:
            buyer[row[5]] = row[4]
            buyer_2[row[5]] = row[2]
        else:
            buyer[row[5]] = float(buyer[row[5]]) + float(row[4])
            buyer_2[row[5]] = buyer_2[row[5]] + row[2]
        # print(f'货物{row[2]***REMOVED***应发往{row[5]***REMOVED***，链接是{row[3]***REMOVED***')
conn.close()
for i in seller:
    print(f'{i***REMOVED***收款{price_conver_2(seller[i])***REMOVED***')
for j in buyer:
    print(f'{j***REMOVED***付款{price_conver_2(buyer[j])***REMOVED***')
for j in buyer_2:
    print(f'{j***REMOVED***付款{buyer_2[j]***REMOVED***')
