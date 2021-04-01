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
db = DATABASE(r'D:\Github\hvAuction\python\database\auction.db')

def price_conver(price):
    price = str(price)
    if price.find('k') != -1 or price.find('K') != -1:
        price = float(price[:-1]) * 1000
    elif price.find('m') != -1 or price.find('M') != -1:
        price = float(price[:-1]) * 1000000
    elif price == 'start':
        price = 50000
    elif price == 'None':
        price = 0
    return price

def update_price(auctionTopicID, auctionDbTable):
    replies_all = api.forum_replies(auctionTopicID)
    bids_all = replies_all['data']
    latestID= "#2"
    for post in bids_all:
        if not post['isEdited']:
            ID = post['postId']
            if ID == '#1' or ID == '#25':
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
                        #print(price)
                    if not price or price == 'None':
                        db.update(auctionDbTable, bid.capitalize(), 'PRICE', price_now)
                        db.update(auctionDbTable, bid.capitalize(), 'Winner', user)
                        db.update(auctionDbTable, bid.capitalize(), 'LOG', postId)
                    elif float(price_now) > float(price):
                        db.update(auctionDbTable, bid.capitalize(), 'PRICE', price_now)
                        db.update(auctionDbTable, bid.capitalize(), 'Winner', user)
                        db.update(auctionDbTable, bid.capitalize(), 'LOG', postId)
                    # out = f'{user***REMOVED***在{ID***REMOVED***中{bid***REMOVED***出价{price***REMOVED***,数据库中{winner***REMOVED***{price***REMOVED***{postId***REMOVED***'
                    # print(out)
            latestID = ID
    print(f'数据库更新成功{latestID***REMOVED***')
    return latestID
def main():
    title = "[Auction]Xuan's Auction #2"
    update_info = "Update to " + update_price(246614, 'ISK002') +" | "+time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())
    content_1 ='''
    [center][img]https://reasoningtheory.net/countdown.png?title=Xuan'Auction&year=2021&month=3&day=21&hour=14&minute=0&expire=[/img][/center]
    [center][color=#33FF33][size=5]Only For Persistent Credits[/size][/color][/center]
    
    [color=#006600]Automatic price updates will now occur every 15 minutes.
    [b]OnceForAll[/b] makes an important contribution to the entire auction program.[/color]
    
    [size=3][b]Auction Rules and Features:[/b][/size]
    
    All posted bids should be in president credits in multiples of 1k and must immediately follow the item code or codes. Codes must match what's displayed in the auction; 5 characters, no spaces.[list]
    [*]One01 200k is valid.
    [*][One02] 1.5m is valid.
    [*]One04 start is valid.
    [*]One05 I will bid 400k is invalid.
    [/list][size=3][b]Minimum bid increments:[/b][/size][list]
    [*]Start/Minimum bid: 50k
    [*]Add at least 50k each time
    [/list]If you want me to auction an item for you, feel free to send stuff any time.
    And the subject must be "For Auction",thanks.
    There are no fees, see this post for details.
    
    [color=#FF0000][size=3][b]Warning:[/b][/size][/color][list]
    [*]Editing of posts before updated will make the bid invalid!
    [*]Never post anything but bids, If there is an error, please try to PM Grandmasters.
    [/list]'''
    edit_post = api.full_edit(90, 246614, 5879662, title, content=content_1, description=update_info)

    bbcode1 = f"[size=3][b]{update_info***REMOVED***[/b][/size]\n\n" + str(db.BBCode('ISK002'))

    edit_post = api.full_edit(90, 246614, 5879663, title, content=bbcode1, description=update_info)

    post_result = json.loads(edit_post)
    if post_result['data'] != 'error':
        print(f"论坛数据更新成功{update_info***REMOVED***")
    else:
        print("论坛数据更新失败")

while 1:
    main()
    time.sleep(1000)
