/* eslint-disable radix */
import cheerio from 'cheerio';
import { EQUIPMENT_STAT_NAMES, EQUIPMENT_TYPES_WITH_SLOTS, HTML_MAGIC_TYPES, PEERLESS_PXP, EXTENDED_SUMMARY_STATS_CONFIG ***REMOVED*** from './constants';
import { EQUIPMENT_RANGES ***REMOVED*** from './rangeDB';

interface ForgeInfo {
  forgeLevel: number,
  baseMultiplier: number,
  scalingFactor: number
***REMOVED***

interface EquipStat {
  htmlName: string,
  scaledValue: number,
  baseForgedValue: number,
  baseUnforgedValue: number
***REMOVED***

const rObsoleteItem = /Flimsy|Fine|Bronze|Iron|Silver|Steel|Gold|Platinum|Titanium|Emerald|Sapphire|Diamond|Prism|trimmed|adorned|tipped|the Ox|the Raccoon|the Cheetah|the Turtle|the Fox|the Owl|Chucks|Ebony|Scythe|Dagger|Astral|Quintessential|Silk|Hide|Buckler of the Fleet|Cloth of the Fleet|Hulk|Aura|Stone-Skinned|Fire-eater|Frost-born|Thunder-child|Wind-waker|Thrice-blessed|Spirit-ward|Chainmail|Coif|Mitons|Hauberk|Chausses|Kevlar|Gossamer|Tower/i;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function parseEquipmentFromDocument(html: string) {
  const $ = cheerio.load(html);

  // ***REMOVED***=== Equipment Name ***REMOVED***==
  const nameDiv = $('#showequip').children().length === 3
    ? $('#showequip').children().eq(0).children().eq(0)
    : $('#showequip').children().eq(1).children().eq(0);
  const name = nameDiv.children().length === 3
    ? `${nameDiv.children().eq(0).text()***REMOVED*** ${nameDiv.children().eq(2).text()***REMOVED***`
    : nameDiv.children().eq(0).text();

  if (name === '') return null;

  // ***REMOVED***=== Equipment Info Parse ***REMOVED***==
  const levelConditionPotencyTierMatches = html.match(/<div>([^&]+)\s(?:&nbsp; ){2***REMOVED***(?:Level\s([0-9]+|Unassigned)\s)?.+(Soulbound|Tradeable|Untradeable).+Condition:.+\((\d+)%.+Tier:\s(\d+)\s(?:\((\d+)\s\/\s(\d+))?/i);
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
  ***REMOVED*** else if (/^of\s/i.test(suffix)) {
    suffix = suffix.substring(3);
  ***REMOVED***

  const type = nameParseMatches[3];
  const slot = EQUIPMENT_TYPES_WITH_SLOTS.includes(type) ? nameParseMatches[4] : '';

  // ***REMOVED***=== Equipment PXP ***REMOVED***==
  const tier = levelConditionPotencyTierMatches && Number(levelConditionPotencyTierMatches[5]);
  const totalPxpThisLevel = levelConditionPotencyTierMatches && Number(levelConditionPotencyTierMatches[7]) || 0;

  let pxp0 = 0;
  if (tier === 0) {
    pxp0 = totalPxpThisLevel;
  ***REMOVED*** else if (tier === 10) {
    // use an average pxp0 for tier 10 equipment
    const searches = PEERLESS_PXP.find(([type]) => name.toLowerCase().includes(type));
    pxp0 = searches ? searches[1] : 400;

    if (quality === 'Legendary') {
      pxp0 = Math.round(pxp0 * 0.95);
    ***REMOVED*** else if (quality === 'Magnificent') {
      pxp0 = Math.round(pxp0 * 0.89);
    ***REMOVED*** else {
      pxp0 = Math.round(pxp0 * 0.8);
    ***REMOVED***
  ***REMOVED*** else {
    // tier is 1-9:
    let estimatePxp0 = 300;

    if (tier) {
      for (let i = 1; i < 15; i++) {
        const sumPxpNextLevel = 1000 * ((1 + estimatePxp0 / 1000) ** (tier + 1) - 1);
        const sumPxpThisLevel = 1000 * ((1 + estimatePxp0 / 1000) ** tier - 1);
        const estimate = sumPxpNextLevel - sumPxpThisLevel;
        if (estimate > totalPxpThisLevel) {
          estimatePxp0 -= 300 / 2 ** i;
        ***REMOVED*** else {
          estimatePxp0 += 300 / 2 ** i;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***

    pxp0 = Math.round(estimatePxp0);
  ***REMOVED***

  // ***REMOVED***=== Equipment Forging / IW ***REMOVED***==
  const butcher = butcherMatches ? Number(butcherMatches[1]) : 0;
  const swiftStrike = swiftStrikeMatches ? Number(swiftStrikeMatches[1]) : 0;
  const archmage = archmageMatches ? Number(archmageMatches[1]) : 0;
  const penetrator = penetratorMatches ? Number(penetratorMatches[1]) : 0;

  const forging: Record<string, ForgeInfo> = {***REMOVED***;
  // insert fake forge data: Physical Damage for Butcher and Magical Damage for Archmage
  const forgeStatusArray = ['Physical Damage Lv.0', 'Magical Damage Lv.0'];
  $('#eu > span').each((i, el) => {
    forgeStatusArray.push($(el).text());
  ***REMOVED***);
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
        ***REMOVED***;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***);

  const forgingKeys = Object.keys(forging);
  const maxForging = forgingKeys.length === 0 ? 0 : forgingKeys.reduce((maxForgeLevel, forgeObjKey) => Math.max(maxForgeLevel, forging[forgeObjKey].forgeLevel), 0);

  // ***REMOVED***=== Equipment Stat ***REMOVED***==
  const equipStats: EquipStat[] = [];
  $('div[title]').each((i, el) => {
    const equipStatObj: EquipStat = {
      htmlName: '',
      scaledValue: 0,
      baseForgedValue: 0,
      baseUnforgedValue: 0
    ***REMOVED***;
    // "+" in "EDB +" (and so on) currently in a text node here will be turned into spans shortly -- Only in browser.
    const spanText = $('span', el).eq(0).text();

    let htmlName;

    if ($(el).parent().parent().attr('id') === 'equip_extended') {
      htmlName = 'Attack Damage';
    ***REMOVED*** else {
      htmlName = $((el as cheerio.TagElement).children[0]).text().trim();
      if (htmlName.includes('+')) {
        htmlName = htmlName.substring(0, htmlName.length - 2);
      ***REMOVED***
    ***REMOVED***

    if (HTML_MAGIC_TYPES.includes(htmlName)) {
      if ($(el).parent().children().eq(0).text()) {
        htmlName += ' MIT';
      ***REMOVED*** else {
        htmlName += ' EDB';
      ***REMOVED***
    ***REMOVED***

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
    ***REMOVED***

    equipStatObj.htmlName = htmlName;
    equipStatObj.scaledValue = parseFloat(spanText);
    equipStatObj.baseForgedValue = parseFloat($(el).attr('title')?.substring(6) || '0');
    equipStatObj.baseUnforgedValue = equipStatObj.baseForgedValue;

    // reverse forging:
    if (htmlName === 'Attack Damage' || htmlName === 'Magic Damage') {
      let iwLevel;
      if (htmlName === 'Attack Damage') {
        iwLevel = butcher;
      ***REMOVED*** else if (htmlName === 'Magic Damage') {
        iwLevel = archmage;
      ***REMOVED*** else {
        iwLevel = 0;
      ***REMOVED***
      const iwCoeff = 1 + 0.02 * iwLevel;

      if (forging[htmlName] || iwLevel) {
        const qualityBonus = ((pxp0 - 100) / 25) * forging[htmlName].baseMultiplier;
        const forgeCoeff = 1 + 0.279575 * Math.log(0.1 * forging[htmlName].forgeLevel + 1); // 0.278875
        const unforgedBase = (equipStatObj.baseUnforgedValue - qualityBonus) / forgeCoeff / iwCoeff + qualityBonus; // iwCoeff for Butcher and Archmage

        equipStatObj.baseUnforgedValue = unforgedBase;
      ***REMOVED***
    ***REMOVED*** else if (forging[htmlName]) {
      const qualityBonus = ((pxp0 - 100) / 25) * forging[htmlName].baseMultiplier;
      const forgeCoeff = 1 + 0.2 * Math.log(0.1 * forging[htmlName].forgeLevel + 1);
      const unforgedBase = (equipStatObj.baseUnforgedValue - qualityBonus) / forgeCoeff + qualityBonus;

      equipStatObj.baseUnforgedValue = unforgedBase;
    ***REMOVED***

    // reverse IW:
    if (htmlName === 'Counter-Resist' && penetrator) {
      equipStatObj.baseUnforgedValue = equipStatObj.baseUnforgedValue - 4 * penetrator;
    ***REMOVED*** else if (htmlName === 'Attack Speed' && swiftStrike) {
      equipStatObj.baseUnforgedValue = equipStatObj.baseUnforgedValue - 1.92 * swiftStrike;
    ***REMOVED***

    equipStats.push(equipStatObj);
  ***REMOVED***);

  // ***REMOVED***=== Equipment Info Generation ***REMOVED***==
  let info = String(level);

  if (name.includes('Buckler') || name.includes('Shield ')) {
    info += pabs?.map(pab => pab.substring(0, 3)).join(' ') || '';
  ***REMOVED***
  if (tier && tier > 0) {
    info += `, IW ${tier***REMOVED***`;
  ***REMOVED***
  if (tier && tier < 10) {
    info += `, PXP ${pxp0***REMOVED***`;
  ***REMOVED***
  if (maxForging > 0) {
    info += `, forged ${maxForging***REMOVED***`;
  ***REMOVED***

  const percentile: Record<string, number> = {***REMOVED***;

  EXTENDED_SUMMARY_STATS_CONFIG.forEach(line => {
    line.nameTests.forEach(nameTest => {
      if (!nameTest.test(name.toLowerCase())) return;

      line.statsToShow.forEach(abbrevName => {
        const htmlName = EQUIPMENT_STAT_NAMES.find(statNameObj => abbrevName === statNameObj.abbr)?.htmlName;

        if (!htmlName) {
          return;
        ***REMOVED***

        const foundEquipStat = equipStats.find(equipStat => equipStat.htmlName === htmlName);

        if (!foundEquipStat) {
          return;
        ***REMOVED***

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const equipRangeByQuality = slot ? EQUIPMENT_RANGES[type][slot] : EQUIPMENT_RANGES[type];
        const qualityToUse = quality === 'Peerless' ? 'Legendary' : quality;
        const statData: {
          [key: string]: { min: number, max: number ***REMOVED***
        ***REMOVED*** = equipRangeByQuality[qualityToUse][htmlName];

        const thisKey = Object.keys(statData).find(prefixSuffixStr => {
          // Keys are formatted like this to give each prefix-suffix combination a predictable key, rather than the key being a random array index. Useful for backend.
          const [prefixTest, suffixTest] = prefixSuffixStr.split(' | ');
          if (prefixTest !== 'all' && prefixTest !== prefix && !prefixTest.includes('not!')) { return false; ***REMOVED***
          if (prefixTest.includes('not!') && prefixTest.split('!').includes(prefix)) { return false; ***REMOVED***
          if (suffixTest !== 'all' && suffixTest !== suffix && !suffixTest.includes('not!')) { return false; ***REMOVED***
          if (suffixTest.includes('not!') && suffixTest.split('!').includes(suffix)) { return false; ***REMOVED***
          return true;
        ***REMOVED***);

        if (thisKey && statData[thisKey]) {
          const percentileNum = Math.round(100 * (foundEquipStat.baseUnforgedValue - statData[thisKey].min) / (statData[thisKey].max - statData[thisKey].min));

          if (percentileNum < 0) return; // lower-than-0 percentiles are not displayed in summary, but they're still accessible via "percentiles" object

          info += `, ${abbrevName***REMOVED*** ${percentileNum***REMOVED***%`;

          percentile[abbrevName] = percentileNum;
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***);
  ***REMOVED***);

  return {
    name,
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
    maxForging
  ***REMOVED***;
***REMOVED***
