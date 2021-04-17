/* eslint-disable radix */
import cheerio from 'cheerio';
import { EQUIPMENT_STAT_NAMES, EQUIPMENT_TYPES_WITH_SLOTS, HTML_MAGIC_TYPES, PEERLESS_PXP, EXTENDED_SUMMARY_STATS_CONFIG } from './constants';
import { EQUIPMENT_RANGES } from './rangeDB';

interface ForgeInfo {
  forgeLevel: number,
  baseMultiplier: number,
  scalingFactor: number
}

interface EquipStat {
  htmlName: string,
  scaledValue: number,
  baseForgedValue: number,
  baseUnforgedValue: number
}

const rObsoleteItem = /Flimsy|Fine|Bronze|Iron|Silver|Steel|Gold|Platinum|Titanium|Emerald|Sapphire|Diamond|Prism|trimmed|adorned|tipped|the Ox|the Raccoon|the Cheetah|the Turtle|the Fox|the Owl|Chucks|Ebony|Scythe|Dagger|Astral|Quintessential|Silk|Hide|Buckler of the Fleet|Cloth of the Fleet|Hulk|Aura|Stone-Skinned|Fire-eater|Frost-born|Thunder-child|Wind-waker|Thrice-blessed|Spirit-ward|Chainmail|Coif|Mitons|Hauberk|Chausses|Kevlar|Gossamer|Tower/i;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function parseEquipmentFromDocument(html: string) {
  const $ = cheerio.load(html);

  // ========== Equipment Name =========
  const nameDiv = $('#showequip').children().length === 3
    ? $('#showequip').children().eq(0).children().eq(0)
    : $('#showequip').children().eq(1).children().eq(0);
  const name = nameDiv.children().length === 3
    ? `${nameDiv.children().eq(0).text()} ${nameDiv.children().eq(2).text()}`
    : nameDiv.children().eq(0).text();

  if (name === '') return null;

  // ========== Equipment Info Parse =========
  const levelConditionPotencyTierMatches = html.match(/<div>([^&]+)\s(?:&nbsp; ){2}(?:Level\s([0-9]+|Unassigned)\s)?.+(Soulbound|Tradeable|Untradeable).+Condition:.+\((\d+)%.+Tier:\s(\d+)\s(?:\((\d+)\s\/\s(\d+))?/i);
  const $nameParseMatches = name.match(/([\w-]+) ([\w-]*?) ?(Axe|Club|Rapier|Shortsword|Wakizashi|Dagger|Sword Chucks|Estoc|Longsword|Mace|Katana|Scythe|Oak|Redwood|Willow|Katalox|Ebony|Buckler|Kite|Force|Tower|Cotton|Phase|Gossamer|Silk|Leather|Shade|Kevlar|Dragon Hide|Plate|Power|Shield|Chainmail|Gold|Silver|Bronze|Diamond|Emerald|Prism|Platinum|Steel|Titanium|Iron) ?((?!of)\w*) ?((?=of)[\w- ]*|$)/i);
  const nameParseMatches = ($nameParseMatches === null || $nameParseMatches.length !== 6) ? ['%%%', '%%%', '%%%', '%%%', '%%%', '%%%'] : [...$nameParseMatches];
  const primaryAttributeBonusMatches = html.match(/Strength|Dexterity|Endurance|Agility|Wisdom|Intelligence/gi);
  const butcherMatches = html.match(/Butcher\sLv.(\d)/);
  const swiftStrikeMatches = html.match(/Swift\sStrike\sLv.(\d)/);
  const archmageMatches = html.match(/Archmage\sLv.(\d)/);
  const penetratorMatches = html.match(/Penetrator\sLv.(\d)/);

  const quality = nameParseMatches[1];
  const level = levelConditionPotencyTierMatches && (Number(levelConditionPotencyTierMatches[2]) || levelConditionPotencyTierMatches[2] || levelConditionPotencyTierMatches[3]);
  const pabs = primaryAttributeBonusMatches?.filter((item, position, self) => self.indexOf(item) === position);

  const prefix = nameParseMatches[2];
  let suffix = nameParseMatches[5];
  if (/of\sthe\s/i.test(suffix)) {
    suffix = suffix.substring(7);
  } else if (/^of\s/i.test(suffix)) {
    suffix = suffix.substring(3);
  }

  const type = nameParseMatches[3];
  const slot = EQUIPMENT_TYPES_WITH_SLOTS.includes(type) ? nameParseMatches[4] : '';

  // ========== Equipment PXP =========
  const tier = levelConditionPotencyTierMatches && Number(levelConditionPotencyTierMatches[5]);
  const totalPxpThisLevel = levelConditionPotencyTierMatches && Number(levelConditionPotencyTierMatches[7]) || 0;

  let pxp0 = 0;
  if (tier === 0) {
    pxp0 = totalPxpThisLevel;
  } else if (tier === 10) {
    // use an average pxp0 for tier 10 equipment
    const searches = PEERLESS_PXP.find(([type]) => name.toLowerCase().includes(type));
    pxp0 = searches ? searches[1] : 400;

    if (quality === 'Legendary') {
      pxp0 = Math.round(pxp0 * 0.95);
    } else if (quality === 'Magnificent') {
      pxp0 = Math.round(pxp0 * 0.89);
    } else {
      pxp0 = Math.round(pxp0 * 0.8);
    }
  } else {
    // tier is 1-9:
    let estimatePxp0 = 300;

    if (tier) {
      for (let i = 1; i < 15; i++) {
        const sumPxpNextLevel = 1000 * ((1 + estimatePxp0 / 1000) ** (tier + 1) - 1);
        const sumPxpThisLevel = 1000 * ((1 + estimatePxp0 / 1000) ** tier - 1);
        const estimate = sumPxpNextLevel - sumPxpThisLevel;
        if (estimate > totalPxpThisLevel) {
          estimatePxp0 -= 300 / 2 ** i;
        } else {
          estimatePxp0 += 300 / 2 ** i;
        }
      }
    }

    pxp0 = Math.round(estimatePxp0);
  }

  // ========== Equipment Forging / IW =========
  const butcher = butcherMatches ? Number(butcherMatches[1]) : 0;
  const swiftStrike = swiftStrikeMatches ? Number(swiftStrikeMatches[1]) : 0;
  const archmage = archmageMatches ? Number(archmageMatches[1]) : 0;
  const penetrator = penetratorMatches ? Number(penetratorMatches[1]) : 0;

  const forging: Record<string, ForgeInfo> = {};
  // insert fake forge data: Physical Damage for Butcher and Magical Damage for Archmage
  const forgeStatusArray = ['Physical Damage Lv.0', 'Magical Damage Lv.0'];
  $('#eu > span').each((i, el) => {
    forgeStatusArray.push($(el).text());
  });
  forgeStatusArray.forEach(status => {
    const matches = status.match(/(.+)\sLv\.(\d+)/);
    if (matches) {
      const forgeName = matches[1];
      const forgeLevel = Number(matches[2]);
      const statNameObj = EQUIPMENT_STAT_NAMES.find(statNameObj => forgeName === statNameObj.forgeName);

      if (statNameObj) {
        forging[statNameObj.htmlName] = {
          forgeLevel,
          baseMultiplier: statNameObj.baseMultiplier,
          scalingFactor: statNameObj.levelScalingFactor || 1
        };
      }
    }
  });

  const forgingKeys = Object.keys(forging);
  const maxForging = forgingKeys.length === 0 ? 0 : forgingKeys.reduce((maxForgeLevel, forgeObjKey) => Math.max(maxForgeLevel, forging[forgeObjKey].forgeLevel), 0);

  // ========== Equipment Stat =========
  const equipStats: EquipStat[] = [];
  $('div[title]').each((i, el) => {
    const equipStatObj: EquipStat = {
      htmlName: '',
      scaledValue: 0,
      baseForgedValue: 0,
      baseUnforgedValue: 0
    };
    // "+" in "EDB +" (and so on) currently in a text node here will be turned into spans shortly -- Only in browser.
    const spanText = $('span', el).eq(0).text();

    let htmlName;

    if ($(el).parent().parent().attr('id') === 'equip_extended') {
      htmlName = 'Attack Damage';
    } else {
      htmlName = $((el as cheerio.TagElement).children[0]).text().trim();
      if (htmlName.includes('+')) {
        htmlName = htmlName.substring(0, htmlName.length - 2);
      }
    }

    if (HTML_MAGIC_TYPES.includes(htmlName)) {
      if ($(el).parent().children().eq(0).text() === 'Damage Mitigations') {
        htmlName += ' MIT';
      } else {
        htmlName += ' EDB';
      }
    }

    if (htmlName === 'HP Bonus'
      || htmlName === 'MP Bonus'
      || (htmlName === 'Holy MIT' && prefix !== 'Zircon')
      || (htmlName === 'Dark MIT' && prefix !== 'Onyx')
      || (htmlName === 'Wind MIT' && prefix !== 'Jade')
      || (htmlName === 'Elec MIT' && prefix !== 'Amber')
      || (htmlName === 'Cold MIT' && prefix !== 'Cobalt')
      || (htmlName === 'Fire MIT' && prefix !== 'Ruby')

      || (htmlName === 'Attack Crit Damage' && prefix !== 'Savage' && type !== 'Power') // Fatality
      || htmlName === 'Counter-Parry' // Overpower
      || (htmlName === 'Attack Speed' && type !== 'Wakizashi' && suffix !== 'Swiftness' && prefix !== 'Agile') // Swift Strike

      || (htmlName === 'Spell Crit Damage' && prefix !== 'Mystic' && type !== 'Phase') // Annihilator
      || (htmlName === 'Mana Conservation' && suffix !== 'Focus' && suffix !== 'Battlecaster' && prefix !== 'Frugal') // Economizer
      || (htmlName === 'Counter-Resist' && type !== 'Willow' && type !== 'Oak') // Penetrator
      || (htmlName === 'Casting Speed' && prefix !== 'Charged') // Spellweaver
    ) {
      return;
    }

    equipStatObj.htmlName = htmlName;
    equipStatObj.scaledValue = parseFloat(spanText);
    equipStatObj.baseForgedValue = parseFloat($(el).attr('title')?.substring(6) || '0');
    equipStatObj.baseUnforgedValue = equipStatObj.baseForgedValue;

    // reverse forging:
    if (htmlName === 'Attack Damage' || htmlName === 'Magic Damage') {
      let iwLevel;
      if (htmlName === 'Attack Damage') {
        iwLevel = butcher;
      } else if (htmlName === 'Magic Damage') {
        iwLevel = archmage;
      } else {
        iwLevel = 0;
      }
      const iwCoeff = 1 + 0.02 * iwLevel;

      if (forging[htmlName] || iwLevel) {
        const qualityBonus = ((pxp0 - 100) / 25) * forging[htmlName].baseMultiplier;
        const forgeCoeff = 1 + 0.279575 * Math.log(0.1 * forging[htmlName].forgeLevel + 1); // 0.278875
        const unforgedBase = (equipStatObj.baseUnforgedValue - qualityBonus) / forgeCoeff / iwCoeff + qualityBonus; // iwCoeff for Butcher and Archmage

        equipStatObj.baseUnforgedValue = unforgedBase;
      }
    } else if (forging[htmlName]) {
      const qualityBonus = ((pxp0 - 100) / 25) * forging[htmlName].baseMultiplier;
      const forgeCoeff = 1 + 0.2 * Math.log(0.1 * forging[htmlName].forgeLevel + 1);
      const unforgedBase = (equipStatObj.baseUnforgedValue - qualityBonus) / forgeCoeff + qualityBonus;

      equipStatObj.baseUnforgedValue = unforgedBase;
    }

    // reverse IW:
    if (htmlName === 'Counter-Resist' && penetrator) {
      equipStatObj.baseUnforgedValue = equipStatObj.baseUnforgedValue - 4 * penetrator;
    } else if (htmlName === 'Attack Speed' && swiftStrike) {
      equipStatObj.baseUnforgedValue = equipStatObj.baseUnforgedValue - 1.92 * swiftStrike;
    }

    equipStats.push(equipStatObj);
  });

  // ========== Equipment Info Generation =========
  let info = String(level);

  if (name.includes('Buckler') || name.includes('Shield ')) {
    info += ` ${pabs?.map(pab => pab.substring(0, 3)).join(' ')}` || '';
  }
  if (tier && tier > 0) {
    info += `, IW ${tier}`;
  }
  if (tier && tier < 10) {
    info += `, PXP ${pxp0}`;
  }
  if (maxForging > 0) {
    info += `, forged ${maxForging}`;
  }

  const percentile: Record<string, number> = {};

  EXTENDED_SUMMARY_STATS_CONFIG.forEach(line => {
    line.nameTests.forEach(nameTest => {
      if (!nameTest.test(name.toLowerCase())) return;

      line.statsToShow.forEach(abbrevName => {
        const htmlName = EQUIPMENT_STAT_NAMES.find(statNameObj => abbrevName === statNameObj.abbr)?.htmlName;

        if (!htmlName) {
          return;
        }

        const foundEquipStat = equipStats.find(equipStat => equipStat.htmlName === htmlName);

        if (!foundEquipStat) {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const equipRangeByQuality = slot ? EQUIPMENT_RANGES[type][slot] : EQUIPMENT_RANGES[type];
        const qualityToUse = quality === 'Peerless' ? 'Legendary' : quality;
        const statData: {
          [key: string]: { min: number, max: number }
        } = equipRangeByQuality[qualityToUse][htmlName];

        const thisKey = Object.keys(statData).find(prefixSuffixStr => {
          // Keys are formatted like this to give each prefix-suffix combination a predictable key, rather than the key being a random array index. Useful for backend.
          const [prefixTest, suffixTest] = prefixSuffixStr.split(' | ');
          if (prefixTest !== 'all' && prefixTest !== prefix && !prefixTest.includes('not!')) { return false; }
          if (prefixTest.includes('not!') && prefixTest.split('!').includes(prefix)) { return false; }
          if (suffixTest !== 'all' && suffixTest !== suffix && !suffixTest.includes('not!')) { return false; }
          if (suffixTest.includes('not!') && suffixTest.split('!').includes(suffix)) { return false; }
          return true;
        });

        if (thisKey && statData[thisKey]) {
          const percentileNum = Math.round(100 * (foundEquipStat.baseUnforgedValue - statData[thisKey].min) / (statData[thisKey].max - statData[thisKey].min));

          if (percentileNum < 0) return; // lower-than-0 percentiles are not displayed in summary, but they're still accessible via "percentiles" object

          info += `, ${abbrevName} ${percentileNum}%`;

          percentile[abbrevName] = percentileNum;
        }
      });
    });
  });

  const data = {
    name,
    category: parseEquipType(name),
    info,
    percentile,
    level,
    tier,
    totalPxpThisLevel,
    quality,
    prefix,
    slot,
    type,
    suffix,
    pabs,
    pxp0,
    isObsolete: Boolean(name.match(rObsoleteItem)),
    forging,
    butcher,
    swiftStrike,
    archmage,
    penetrator,
    maxForging,
    bbcode: ''
  };

  data.bbcode = generateBBCode(data);

  return data;
}

interface BBCodeSnippetType {
  code?: string,
  color?: string,
  bold?: boolean,
  the?: boolean
}

function parseEquipType(name: string): '1H' | '2H' | 'Staff' | 'Shield' | 'Cloth' | 'Light' | 'Heavy' | undefined {
  if (
    name.includes('Axe')
    || name.includes('Club')
    || name.includes('Rapier')
    || name.includes('Shortsword')
    || name.includes('Wakizashi')
  ) return '1H';
  if (
    name.includes('Estoc')
    || name.includes('Longsword')
    || name.includes('Mace')
    || name.includes('Katana')
  ) {
    return '2H';
  }
  if (name.includes('Staff')) return 'Staff';
  if (name.includes('Shield') || name.includes('Buckler')) return 'Shield';
  if (name.includes('Cotton') || name.includes('Phase')) return 'Cloth';
  if (name.includes('Leather') || name.includes('Shade')) return 'Light';
  if (name.includes('Plate') || name.includes('Power')) return 'Heavy';
}

function generateBBCode(equipInfo: ReturnType<typeof parseEquipmentFromDocument>): string {
  const peerlessRainbow = (text: string) => {
    const c = ['#f00', '#f90', '#fc0', '#0c0', '#09f', '#00c', '#c0f'], l = c.length;
    return text.split('').map((t, i) => `[color=${c[i % l]}]${t}[/color]`).join('');
  };

  const color1 = '#f00';
  const color2 = '#f90';

  const all: BBCodeSnippetType = {};
  const quality: BBCodeSnippetType = { code: equipInfo?.quality };
  const prefix: BBCodeSnippetType = { code: equipInfo?.prefix };
  const type: BBCodeSnippetType = { code: equipInfo?.type };
  const slot: BBCodeSnippetType = { code: equipInfo?.slot };
  const suffix: BBCodeSnippetType = { code: equipInfo?.suffix };

  if (equipInfo?.category === '1H') {
    if (equipInfo?.name.includes('Rapier') && equipInfo.suffix === 'Slaughter') {
      if (equipInfo.prefix === 'Ethereal' || equipInfo.prefix === 'Hallowed' || equipInfo.prefix === 'Demonic') {
        prefix.color = color1;
        type.bold = true;
        suffix.bold = true;
      }
    } else if ((equipInfo?.name.includes('Rapier') || equipInfo?.type === 'Wakizashi') && (equipInfo.suffix.includes('Nimble') || equipInfo.suffix.includes('Balance'))) {
      if (equipInfo.prefix === 'Ethereal') {
        prefix.color = color1;
      }
      type.bold = true;
    } else if ((equipInfo?.type === 'Club' || equipInfo?.type === 'Shortsword' || equipInfo?.type === 'Axe') && equipInfo.suffix === 'Slaughter') {
      if (equipInfo.prefix === 'Ethereal') {
        prefix.color = color1;
      }
      type.bold = true;
      suffix.color = color1;
    }
  } else if (equipInfo?.category === '2H') {
    if (equipInfo.suffix === 'Slaughter') {
      prefix.color = color1;
      type.bold = true;
      suffix.color = color1;
    }
  } else if (equipInfo?.category === 'Staff') {
    if (equipInfo.type === 'Oak') {
      if (equipInfo.prefix === 'Hallowed' && equipInfo.suffix === 'Heimdall') {
        prefix.bold = true;
        type.bold = true;
        suffix.bold = true;
      }
    } else if (equipInfo.type === 'Willow') {
      if (['Shocking', 'Tempestuous', 'Demonic'].includes(equipInfo.prefix) && equipInfo.suffix === 'Destruction') {
        prefix.bold = true;
        type.bold = true;
        suffix.bold = true;
      }
    } else if (equipInfo.type === 'Katalox') {
      const $prefix = ({ 'Hallowed': 5, 'Demonic': 6 })[equipInfo.prefix];
      const $suffix = ({ 'Destruction': -1, 'Heimdall': 5, 'Fenrir': 6, 'Heaven-sent': 8, 'Demon-fiend': 9 })[equipInfo.suffix];
      if ($prefix && $suffix) {
        if ($suffix === -1) {
          prefix.bold = true;
          type.bold = true;
          suffix.bold = true;
        } else if ($suffix === $prefix) {
          prefix.bold = true;
          type.bold = true;
        } else if ($suffix === $prefix + 3) {
          prefix.bold = true;
          type.bold = true;
        }
      }
    } else if (equipInfo.type === 'Redwood') {
      const $prefix = ({ 'Fiery': 1, 'Arctic': 2, 'Shocking': 3, 'Tempestuous': 4 })[equipInfo.prefix];
      const $suffix = ({ 'Destruction': -1, 'Surtr': 1, 'Niflheim': 2, 'Mjolnir': 3, 'Freyr': 4, 'Elementalist': 7 })[equipInfo.suffix];
      if ($prefix && $suffix) {
        if ($suffix === -1) {
          prefix.bold = true;
          type.bold = true;
          suffix.bold = true;
        } else if ($suffix === $prefix) {
          prefix.bold = true;
          type.bold = true;
        } else if ($suffix === 7) {
          prefix.bold = true;
          type.bold = true;
        }
      }
    }
  } else if (equipInfo?.category === 'Shield') {
    if (equipInfo.type === 'Force') {
      type.bold = true;
      suffix.bold = ['Protection', 'Dampening', 'Deflection'].includes(equipInfo.suffix);
    } else if (equipInfo.type === 'Buckler' && ['Barrier', 'Battlecaster'].includes(equipInfo.suffix)) {
      if (equipInfo.prefix === 'Reinforced') prefix.color = color1;
      type.bold = true;
      suffix.bold = true;
    }
  } else if (equipInfo?.category === 'Cloth') {
    if (equipInfo.type === 'Phase') {
      prefix.color = ({ 'Radiant': color1, 'Charged': color1, 'Mystic': color2, 'Frugal': color2 })[equipInfo.prefix];
      type.bold = true;
    } else if (equipInfo.type === 'Cotton' && ['Elementalist', 'Heaven-sent', 'Demon-fiend'].includes(equipInfo.suffix)) {
      prefix.color = ({ 'Charged': color1, 'Frugal': color2 })[equipInfo.prefix];
      suffix.bold = true;
    }
  } else if (equipInfo?.category === 'Light') {
    if (equipInfo.type === 'Shade') {
      prefix.color = ({ 'Savage': color1, 'Agile': color2 })[equipInfo.prefix];
      type.bold = true;
      suffix.bold = equipInfo.suffix === 'Shadowdancer';
    } else if (equipInfo.type === 'Leather') {
      prefix.color = ({ 'Reinforced': color1 })[equipInfo.prefix];
    }
  } else if (equipInfo?.category === 'Heavy') {
    if (equipInfo.type === 'Power') {
      prefix.color = ({ 'Savage': color1 })[equipInfo.prefix];
      type.color = color1;
      if (equipInfo.suffix === 'Slaughter') suffix.color = color1;
    } else if (equipInfo.type === 'Plate') {
      prefix.color = ({ 'Shielding': color1 })[equipInfo.prefix];
      suffix.bold = equipInfo.suffix === 'Protection';
    }
  } else {
    all.code = equipInfo?.name;
  }

  if (equipInfo?.quality === 'Peerless') {
    quality.code = peerlessRainbow(quality.code || 'Peerless');
    quality.bold = true;
  }

  if (/Nimble|Heaven-sent|Demon-fiend|Elementalist|Battlecaster|Barrier|Shadowdancer/.test(equipInfo?.suffix || '')) suffix.the = true;
  if (/Oak|Redwood|Willow|Katalox|Ebony/.test(type.code || '')) type.code += ' Staff';
  [quality, prefix, slot, suffix, type].forEach(i => {
    if (i.color) {
      if (i.code !== '') {
        i.code = `[b][color=${i.color}]${i.code}[/color][/b]`;
      }
    } else if (i.bold) {
      if (i.code !== '') {
        i.code = `[b]${i.code}[/b]`;
      }
    }
    if (i.the) i.code = `the ${i.code}`;
  });

  all.code = all.code || `${quality.code + (prefix.code ? ` ${prefix.code}` : '')} ${type.code}${slot.code ? ` ${slot.code}` : ''}${suffix.code ? ` of ${suffix.code}` : ''}`;

  if (all.color && all.code !== '') { all.code = `[color=${all.color}]${all.code}[/color]`; }
  if (all.bold && all.code !== '') { all.code = `[b]${all.code}[/b]`; }

  return all.code;
}
