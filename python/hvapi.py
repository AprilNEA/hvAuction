***REMOVED***
import urllib

class HVAPI:
    def __init__(self, SEVEAR):
        self.sevear = SEVEAR

    # 通过帖子 ID 获取所有回复（以及解析过的出价）
    def forum_replies(self, id):
        url = f'{self.sevear***REMOVED***/forum/replies/{id***REMOVED***'
        response = requests.get(url)
        return response.json()

    # 通过帖子 ID 获取所有物品的出价记录
    def bids_uid(self, id):
        url = f'{self.sevear***REMOVED***/bids/{id***REMOVED***/'
        response = requests.get(url)
        return response.json()

    # 通过帖子 ID 和物品 ID 获取当前物品的出价记录
    def bids_item(self, id, item):
        url = f'{self.sevear***REMOVED***/bids/{id***REMOVED***/{item***REMOVED***'
        response = requests.get(url)
        return response.json()

    # 通过装备链接获取相关信息和BBCode
    def equip_allinfo(self, link):
        url = f'{self.sevear***REMOVED***/hv/equip/?url={link***REMOVED***'
        response = requests.get(url)
        return response.json()

    # 自动编辑帖子
    # forum区域 id主贴编号 Id回复编号
    def auto_edit(self, forum, id, postId, content):
        url = f'{self.sevear***REMOVED***/forum/edit/{forum***REMOVED***/{id***REMOVED***/{postId***REMOVED***/'
        instances = {"content": content***REMOVED***
        response = requests.post(url, json=instances)
        return response.text

    def equip_info(self, link):
        equip_allinfo = requests.get(f'{self.sevear***REMOVED***/hv/equip/?url={link***REMOVED***').json  # info 装备信息
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

