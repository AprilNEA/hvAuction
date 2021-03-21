import json
***REMOVED***
import sqlite3
import urllib
from datetime import datetime
import time
from hvapi import HVAPI
from databasesq3 import DATABASE

api = HVAPI(r'http://hk.sukeycz.com:3001')
db = DATABASE(r'D:\Github\hv-Auction\database\auction.db')

def price_conver(price):
    price = str(price)
    if price.find('k') != -1 or price.find('K') != -1:
        price = float(price[:-1]) * 1000
    elif price.find('m') != -1 or price.find('M') != -1:
        price = float(price[:-1]) * 1000000
    elif price == 'start':
        price = 50000
    return price

def update_price(auctionTopicID, auctionDbTable):
    replies_all = api.forum_replies(auctionTopicID)
    bids_all = replies_all['data']
    for post in bids_all:
        if not post['isEdited']:
            ID = post['postId']
            if ID == '#1':
                continue
            user = post['username']
            bids = post['bid']
            postId = post['postId']
            for bid in bids:
                # bid为物品，price为出价
                if bid:
                    # bid = bid.capitalize()
                    price_now = str(bids[bid])
                    price_now = price_conver(price_now)
                    # print(price_now)
                    winner, price = db.search_byid('ISK002', bid.capitalize())
                    if price:
                        price = price_conver(price)
                        # print(price)
                    if not price:
                        db.update(auctionDbTable, bid.capitalize(), 'PRICE', price_now)
                        db.update(auctionDbTable, bid.capitalize(), 'Winner', user)
                        db.update(auctionDbTable, bid.capitalize(), 'LOG', postId)
                    elif float(price_now) > float(price):
                        db.update(auctionDbTable, bid.capitalize(), 'PRICE', price_now)
                        db.update(auctionDbTable, bid.capitalize(), 'Winner', user)
                        db.update(auctionDbTable, bid.capitalize(), 'LOG', postId)
                    # out = f'{user***REMOVED***在{ID***REMOVED***中{bid***REMOVED***出价{price***REMOVED***,数据库中{winner***REMOVED***{price***REMOVED***{postId***REMOVED***'
                    # print(out)
    print('数据库更新成功')
    return 0



while True:
    update_price(246614, 'ISK002')
    time.sleep(5)
    bbcode1 = str(db.BBCode('ISK002'))
    time.sleep(5)
    print(bbcode1)
    editpost = api.auto_edit(90, 246614, 5879663, bbcode1)
    print(editpost)
    time.sleep(1000)

