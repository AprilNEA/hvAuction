import requests
import csv
import sqlite3
from operator import itemgetter, attrgetter

SERVER = 'http://hk.sukeycz.com:3001'


def equip_allinfo(link):
    url = f'{SERVER}/hv/equip/?url={link}'
    response = requests.get(url)
    return response.json()

One, Two, Staff, Shield, Cloth, Light, Heavy = [], [], [], [], [], [], []

def equip_in(info,seller,link):
    if info["category"] != None:
        if info["category"] == "1H":
            category = "One"
        elif info["category"] == "2H":
            category = "Two"
        else:
            category = info["category"]
    info["seller"] = seller
    info["link"] = link
    eval(f'{category}.append({info})')  # 对每个装备进行大分类归档

SERVER = 'http://hk.sukeycz.com:3001'
db_name = r'D:\Github\hvAuction\python\database\auction.db'
def add(table, key, seller, name, link, features):
    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    sql = f"INSERT INTO {table}(ID,SELLER,NAME,LINK,FEATURES) VALUES ('{key}','{seller}','{name}','{link}','{features}')"
    c.execute(sql)
    conn.commit()
    print(f'Record {key},{seller},{name},{features} created successfully')
    conn.close()
equipdate = csv.reader(open('equip_info/4.csv', 'r', encoding='utf-8-sig'))
for i in equipdate:
    if i[2] == '1':
        a = equip_allinfo(i[1])["data"]
        # print(a)
        if a != None:
            equip_in(a,i[0],i[1])
    elif i[2] == '0':
        print(i[1] + i[0] + i[2])
        add('ISK004', i[0], i[1], i[2], '0', '0')


def weight(equip):
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
    weig = sort_quality[equip["quality"]] * 10000 + sort_slot[equip["slot"]] * 1000 + sort_type[equip["type"]]*100+sort_prefix[equip["prefix"]]*10+sort_suffix [equip["suffix"]]
    return weig

for equip_set in One, Two, Staff, Shield, Cloth, Light, Heavy:
    equip_set = sorted(equip_set, key=lambda equip: weight(equip))
    print(equip_set)
    for i in equip_set:
        # def add(table,key,seller,name,link,features):
        add('ISK004', i[0], i[1], i[2], i[4], i[3])



