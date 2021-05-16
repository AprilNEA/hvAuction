# -*- coding: utf-8 -*-
from package.hvapi import *
from package.databasesq3 import *
import json
import time


config = json.load(open('config.json'))
api = HVAPI(config['api_server'])
db = DATABASE(config['database'])
AUCTION_ID = 'ISK005'

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
    replies_all = api.forum_replies(auctionTopicID)
    bids_all = replies_all['data']
    # print(bids_all)


    for post in bids_all:
        if not post['isEdited']:
            ID = int(post['postId'][1:])
            ignore = [4]
            if ID <= latestID and ID in ignore:  # 跳过已更新过的帖子
                continue
            user = post['username']
            bids = post['bid']
            postId = post['postId']

            for bid_key in bids:
                if ID == 4:
                    break
                # bid为物品序号(mat01)
                if bid_key:
                    if bids[bid_key] != 'none':
                        price_new = price_abb_conver(bids[bid_key])  # 确保出价缩写被转换成数字
                    else:
                        continue
                    bid_key = bid_key.capitalize()  # 将拍卖序号确保首字母大写后查询(Mat01)
                    winner, price_current = db.search_byid(AUCTION_ID, bid_key)  # 查询此物品的当前拥有者和出价，
                    # price_new为最新出价，price_current为数据库中当前出价
                    # TODO 已数字的形式在数据库中存储价格而非带价格缩写的字符串

                    if price_current != 'none':
                        price_current = price_abb_conver(price_current)
                    else:
                        continue

                    if price_current == 'none':
                        db.update(auctionDbTable, bid_key, 'PRICE', price_new)
                        db.update(auctionDbTable, bid_key, 'Winner', user)
                        db.update(auctionDbTable, bid_key, 'LOG', postId)
                    elif float(price_new)-float(price_current) >= 0.05 * float(price_current):
                        db.update(auctionDbTable, bid_key, 'PRICE', price_new)
                        db.update(auctionDbTable, bid_key, 'Winner', user)
                        db.update(auctionDbTable, bid_key, 'LOG', postId)
                    else:
                        pass

                    # out = f'{user}在{ID}中{bid}出价{price},数据库中{winner}{price}{postId}'
                    # print(out)

            latestID = ID
    print(f'数据库更新成功{latestID}')
    return latestID


def main():
    ###拍卖信息###
    start_time = 1618607206
    end_time = 1618718400
    auction_id = '5'
    auctionDbTable = AUCTION_ID
    topic_id = 248056
    post_n1 = 5909488
    post_n2 = 5909489
    ###———————###
    with open(r'D:\Github\hvAuction\python\data\auction_stauts.json', 'rb') as f:
        status = json.load(f)
        lastestID = status["ProceedToID"]

    title = f"[Auction]Xuan's Auction #{auction_id}"

    lastestID_get = update_price(lastestID, topic_id, auctionDbTable)
    if lastestID_get == lastestID:
        return 0
    with open(r'D:\Github\hvAuction\python\data\auction_stauts.json', 'w') as r:
        status_dict = {
            "ProceedToID": lastestID_get
        }
        json.dump(status_dict, r)

    update_info = "Update to #" + str(lastestID_get) +" | "+time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())
    # update_info = "Update to " + update_price(topic_id, datebaseID) + " | Ended"  # 拍卖进展信息

    # 第一帖信息：时间，规则，banlist，forbiddenlist
    content_1 = open("bbcode/isekai_auction_n1.txt",).read()
    edit_post_n1 = api.full_edit(forum=4, id=topic_id, postId=post_n1, title=title, content=content_1,
                                 description=update_info)
    post_result_n1 = json.loads(edit_post_n1)
    #print(str(db.BBCode(AUCTION_ID)))

    # 第二贴信息：拍卖数据
    bbcode1 = f"[size=3][b]{update_info}[/b][/size]\n\n" + str(db.BBCode(AUCTION_ID))
    edit_post_n2 = api.full_edit(4, topic_id, post_n2, title, content=bbcode1, description=update_info)
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
        time.sleep(500)
