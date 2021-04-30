# -*- coding: utf-8 -*-
import json
import time
from python.package.hvapi import HVAPI
from python.package.databasesq3 import DATABASE

api = HVAPI(r'http://hk.sukeycz.com:3001')
db = DATABASE(r'D:\Github\hvAuction\python\package\auction.db')


def price_abb_conver(price):
    price = str(price).lower()
    if price.find('k') != -1 or price.find('K') != -1:
        price = float(price[:-1]) * 1000
    elif price.find('m') != -1 or price.find('M') != -1:
        price = float(price[:-1]) * 1000000
    elif price == 'start':
        price = 50000
    elif price == 'None':
        price = 0
    return price


def update_price(latestID, auctionTopicID, auctionDbTable):
    replies_all = api.forum_replies(auctionTopicID)  # 通过API获取论坛回复
    bids_all = replies_all['data']
    # print(bids_all)

    for post in bids_all:
        if not post['isEdited']:
            ID = int(post['postId'][1:])
            if ID <= int(latestID[1:]):  # 跳过已更新过的帖子
                continue
            user = post['username']
            bids = post['bid']
            postId = post['postId']

            for bid_key in bids:
                # bid为物品序号(mat01)
                # FIXME 大小写
                if bid_key:
                    print(bids)
                    price_new = price_abb_conver(bids[bid_key])  # 确保出价缩写被转换成数字
                    winner, price_current = db.search_byid('ISK004', bid_key)  # 查询此物品的当前拥有者和出价，
                    bid_key = bid_key.capitalize()  # 将拍卖序号确保首字母大写后查询(Mat01)
                    # price_new为最新出价，price_current为数据库中当前出价
                    # TODO 已数字的形式在数据库中存储价格而非带价格缩写的字符串
                    if price_current:
                        price_current = price_abb_conver(price_current)
                    # TODO 简化数据库更新语句
                    if not price_current or price_current == 'None':
                        db.update(auctionDbTable, bid_key, 'PRICE', price_new)
                        db.update(auctionDbTable, bid_key, 'Winner', user)
                        db.update(auctionDbTable, bid_key, 'LOG', postId)
                    elif float(price_new) > float(price_current):
                        db.update(auctionDbTable, bid_key, 'PRICE', price_new)
                        db.update(auctionDbTable, bid_key, 'Winner', user)
                        db.update(auctionDbTable, bid_key, 'LOG', postId)
                    # out = f'{user}在{ID}中{bid}出价{price},数据库中{winner}{price}{postId}'
                    # print(out)

            latestID = postId
    print(f'数据库更新成功{latestID}')
    return latestID


def main():
    ###拍卖信息###
    start_time = 1618607206
    end_time = 1618718400
    auction_id = '4'
    auctionDbTable = 'ISK004'
    topic_id = 247345
    post_n1 = 5893951
    post_n2 = 5893952
    ###———————###
    lastestID = '#2'
    title = f"[Auction]Xuan's Auction #{auction_id}"
    update_info = "Update to " + update_price(lastestID, topic_id, auctionDbTable) +" | "+time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())
    # update_info = "Update to " + update_price(topic_id, datebaseID) + " | Ended"  # 拍卖进展信息

    # 第一帖信息：时间，规则，banlist，forbiddenlist
    content_1 = open("bbcode/isekai_auction_n1.txt",).read()
    edit_post_n1 = api.full_edit(forum=90, id=topic_id, postId=post_n1, title=title, content=content_1,
                                 description=update_info)
    post_result_n1 = json.loads(edit_post_n1)
    print(str(db.BBCode('ISK004')))
    # 第二贴信息：拍卖数据
    bbcode1 = f"[size=3][b]{update_info}[/b][/size]\n\n" + str(db.BBCode('ISK004'))
    edit_post_n2 = api.full_edit(90, topic_id, post_n2, title, content=bbcode1, description=update_info)
    post_result_n2 = json.loads(edit_post_n2)

    if post_result_n2['data'] != 'error':
        print(f"第二贴数据更新成功{update_info}")
        if post_result_n1['data'] != 'error':
            print(f"第一贴拍卖进度更新成功{update_info}")
    else:
        print("论坛数据更新失败")


if __name__ == '__main__':
    while 1:
        main()
        time.sleep(100)
