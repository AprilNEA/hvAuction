from db import HVAPI
from db import DATABASE
import json

config = json.load(open('../conf/config.json'))
api = HVAPI(config['api_server'])
db = DATABASE(config['db'])
AUCTION_ID = 'ISK005'

Mat, One, Two, Sta, Shd, Clo, Lig, Hea = [], [], [], [], [], [], [], []


def smallinfo(link):
    allinfo = api.equip_allinfo(link)
    features = str(allinfo['data']['level'])  # features(前置等级) 准备输出精简属性
    percentiles = allinfo['data']['percentile']
    forging = allinfo['data']['forging']
    name = allinfo['data']['name']
    number = 0
    useful_pers = ['ADB', 'Parry', 'BLK', 'MDB', 'EDB', 'Divine EDB', 'Forb EDB', 'Elec EDB', 'Wind EDB',
                   'Cold EDB',
                   'Fire EDB', 'Elem Prof']

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

# 将武器分类缩写成三个字符
def category_to_three(category):
    if category != None:  # FIXME IF NONE HOW
        if category == "1H":
            category = "One"
        elif category == "2H":
            category = "Two"
        elif category == "Shield":
            category = "Shd"
        else:
            category = category[:3]
    return category

# 对每个装备进行大分类归档
def equip_in(info, seller, link):
    category = category_to_three(info["category"])
    info["seller"] = seller
    info["link"] = link
    info["info_small"] = smallinfo(link)
    info["category_3"] = category
    eval(f'{category}.append({info})')

def weight_equip(equip):
    sort_quality = {
        "Superior": 5,
        "Exquisite": 4,
        "Magnificent": 3,
        "Legendary": 2,
        "Peerless": 1,
        "": 10
    }
    sort_slot = {
        "Cap": 1,  # Head
        "Helmet": 1,
        "Robe": 2,  # Body
        "Breastplate": 2,
        "Cuirass": 2,
        "Armor": 2,
        "Gloves": 3,  # Hands
        "Gauntlets": 3,
        "Pants": 4,  # Legs
        "Leggings": 4,
        "Greaves": 4,
        "Shoes": 5,  # Feet
        "Boots": 5,
        "Sabatons": 5,
        "": 10
    }
    sort_type = {
        "Axe": 5,
        "Club": 4,
        "Rapier": 1,
        "Shortsword": 3,
        "Wakizashi": 2,
        "Katalox": 1,
        "Estoc": 1,
        "Longswor": 2,
        "Mace": 3,
        "Katana": 4,
        "Oak": 3,
        "Redwood": 2,
        "Willow": 1,
        "Buckler": 1,
        "Kite": 2,
        "Force": 1,
        "Cotton": 2,
        "Phase": 1,
        "Leather": 2,
        "Shade": 1,
        "Plate": 2,
        "Power": 1,
        "": 10
    }
    sort_prefix = {
        "Charged": 2,  # Cloth
        "Frugal": 3,
        "Radiant": 1,
        "Mystic": 2,
        "Reinforced": 2,  # Heavy/Shield
        "Shielding": 3,  # Heavy
        "Agile": 3,  # Light/Shield
        "Savage": 1,  # Light/Heavy
        "Mithril": 3,  # Heavy/Shield
        "Ruby": 5,
        "Cobalt": 5,
        "Amber": 5,
        "Jade": 5,
        "Zircon": 5,
        "Onyx": 5,
        "Fiery": 3,
        "Arctic": 4,
        "Shocking": 5,
        "Tempestuous": 6,
        "Hallowed": 1,
        "Demonic": 2,
        "Ethereal": 0,
        "": 10
    }
    sort_suffix = {
        "Slaughter": 1,
        "Balance": 4,
        "Battlecaster": 5,
        "Nimble": 3,
        "Vampire": 6,
        "Banshee": 1,
        "Swiftness": 2,
        "Destruction": 1,
        "Surtr": 4,
        "Niflheim": 4,
        "Mjolnir": 4,
        "Freyr": 4,
        "Heimdall": 3,
        "Fenrir": 3,
        "Focus": 2,
        "Elementalist": 7,
        "Heaven-sent": 5,
        "Demon-fiend": 5,
        "Earth-walker": 7,
        "Curse-weaver": 6,
        "Barrier": 2,
        "Protection": 3,
        "Shadowdancer": 1,
        "Fleet": 2,
        "Negation": 3,
        "Deflection": 8,
        "Defenses": 7,
        "Dampening": 10,
        "Stoneskin": 8,
        "Warding": 8,
        "": 10
    }
    weig = sort_quality[equip["quality"]] * 100000 + sort_slot[equip["slot"]] * 1000 + sort_type[equip["type"]] * 100 + \
           sort_prefix[equip["prefix"]] * 10 + sort_suffix[equip["suffix"]]
    return weig

def weight_item(item):
    weight = 0
    if "Scroll" or "Infusion" or "Vase" or "Gum" in item:
        weight -= 3000
    if "Draught" or "Potion" or "Elixir" in item:
        weight -= 4000

    if "Low" in item:
        weight += 100
    if "Mid" in item:
        weight += 200
    if "High" in item:
        weight += 300

    if "Cloth" in item:
        weight += 4000
    if "Leather" in item:
        weight += 3000
    if "Metals" in item:
        weight += 2000
    if "Wood" in item:
        weight += 1000

    if "Crystallized Phazon" in item:
        weight += 104
    if "Shade Fragment" in item:
        weight += 103
    if "Repurposed Actuator" in item:
        weight += 102
    if "Defense Matrix Modulator" in item:
        weight += 101

    if "Scrap" or "Energy Cell" in item:
        weight -= 2000
    if "Diluted Catalyst" in item:
        weight -= 1000
    if "Shard" in item:
        weight -= 500

    return weight




if __name__ == '__main__':
    auction_mail, not_auction_mail = api.mail_list()
    print('邮件获取完毕')
    item_list = []
    # 对材料进行特殊处理
    mat_count = 0
    #print(not_auction_mail)
    print(auction_mail)
    exit()
    for mail in auction_mail:

        if 'attachments' in mail:
            if 'items' in mail['attachments']:
                for item in mail['attachments']['items']:
                    item = {
                        'seller': mail['seller'],
                        'item_name': item
                    }
                    item_list.append(item)

            if 'equips' in mail['attachments']:
                for equip in mail['attachments']['equips']:
                    equip_link = mail['attachments']['equips'][equip]
                    equip_info = api.equip_allinfo(equip_link)["data"]
                    if equip_info != None:
                        equip_in(equip_info, mail['seller'], equip_link)

    count = 0
    for items in item_list:
        print(items)
        count += 1
        if count <= 9:
            count_str = f'0{count}'
        else:
            count_str = count
        # def add(table,key,seller,name,link,features):
        db.add('ISK005', f'Mat{count_str}', items['seller'], items['item_name'], '0', '0')
        print(f'Mat{count_str}', items['seller'], items['item_name'])


    for equip_set in One, Two, Sta, Shd, Clo, Lig, Hea:
        equip_set = sorted(equip_set, key=lambda equip: weight_equip(equip))
        print(equip_set)
        count = 0
        for i in equip_set:
            count += 1
            if count <= 9:
                count_str = f'0{count}'
            else:
                count_str = count
            # def add(table,key,seller,name,link,features):
            db.add('ISK005', f'{i["category_3"]}{count_str}', i["seller"], i["bbcode"], i["link"], i["info_small"])
            print(f'{i["category_3"]}{count_str}', i["seller"], i["bbcode"], i["link"], i["info"])

    item_list = sorted(item_list, key=lambda item: weight_item(item['item_name']), reverse=True)



