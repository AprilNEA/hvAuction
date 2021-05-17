import requests
import urllib

class HVAPI:
    def __init__(self, SEVEAR):
        self.SERVER = SEVEAR

    # 通过帖子 ID 获取所有回复（以及解析过的出价）
    def forum_replies(self, id):
        url = f'{self.SERVER}/forum/replies/{id}'
        response = requests.get(url)
        return response.json()

    # 通过帖子 ID 获取所有物品的出价记录
    def bids_uid(self, id):
        url = f'{self.SERVER}/bids/{id}/'
        response = requests.get(url)
        return response.json()

    # 通过帖子 ID 和物品 ID 获取当前物品的出价记录
    def bids_item(self, id, item):
        url = f'{self.SERVER}/bids/{id}/{item}'
        response = requests.get(url)
        return response.json()

    # 通过装备链接获取相关信息和BBCode
    def equip_allinfo(self, link):
        url = f'{self.SERVER}/hv/equip/?url={link}'
        response = requests.get(url)
        return response.json()

    # 自动编辑帖子
    # forum区域 id主贴编号 Id回复编号
    def quick_edit(self, forum, id, postId, content):
        url = f'{self.SERVER}/forum/edit/{forum}/{id}/{postId}/'
        #content = content.encode('utf-8')
        instances = {"content": content}
        response = requests.post(url, json=instances)
        return response.text

    # 自动编辑帖子
    # forum区域 id主贴编号 Id回复编号
    def full_edit(self, forum, id, postId, title, content, description=""):
        url = f'{self.SERVER}/forum/full_edit/{forum}/{id}/{postId}/'
        # content = content.encode('utf-8')
        instances = {
            "title": title,
            "content": content,
            "description": description
        }
        response = requests.post(url, json=instances)
        return response.text

    #拍卖系统检查邮件
    def mail_list(self, isk=True):
        if isk:
            url = f'{self.SERVER}/hv/mooglemail/list?isekai=1'
        else:
            url = f'{self.SERVER}/hv/mooglemail/list'
        mid_list = requests.get(url).json()['data']
        auction_mail = []
        not_auction_mail = []
        print(mid_list)

        for mid in mid_list:

            if isk:
                mid_url = f"{self.SERVER}/hv/mooglemail/mail/{mid}?isekai=1"
            else:
                mid_url = f"{self.SERVER}/hv/mooglemail/mail/{mid}"

            mid_out = requests.get(mid_url).json()

            if mid_out['code'] == 0 and mid_out['msg'] == 'OK':
                #print(mid_out)
                if 'Auction' in mid_out['data']['title'] or 'auction' in mid_out['data']['title']:
                    auction_mail.append({
                        "seller": mid_out['data']['sender'],
                        "title": mid_out['data']['title'],
                        "content": mid_out['data']['content'],
                        "mmtoken": mid_out['data']['mmtoken'],
                        "cod": mid_out['data']['cod'],
                        "attachments": mid_out['data']['attachments'],
                        "mid": mid,
                    })
                else:
                    #not_auction_mail.append(mid)
                    auction_mail.append(mid)
            else:
                print(f'{mid}出错:{mid_out}')
                return 0
        return auction_mail, not_auction_mail

    def equip_smart_info(self, link):
        equip_allinfo = requests.get(f'{self.SERVER}/hv/equip/?url={link}').json  # info 装备信息
        features = str(equip_allinfo['data']['level'])  # features(前置等级) 准备输出精简属性
        percentiles = equip_allinfo['data']['percentile']
        forging = equip_allinfo['data']['forging']
        name = equip_allinfo['data']['name']
        number = 0
        useful_pers = ['ADB', 'Parry', 'BLK', 'MDB', 'EDB', 'Divine EDB', 'Forb EDB', 'Elec EDB', 'Wind EDB',
                       'Cold EDB',
                       'Fire EDB', 'Elem Prof']
        # if name.find('')
        for useful_per in useful_pers:
            if number < 2:
                if useful_per in percentiles:
                    features = ''.join([features, ", " + useful_per + " " + str(percentiles[useful_per]) + "%"])
                    number = number + 1
                if useful_per in forging:
                    features = ''.join(
                        [features, ", " + useful_per + " " + str(forging[useful_per]['forgeLevel']) + "%"])
                    number = number + 1
            else:
                break
        return features

