/* eslint-disable radix */
import cheerio from 'cheerio';
import { getPage ***REMOVED*** from '../../util/network';
import { EQUIP_RANGES, EQUIP_STATS_NAMES, HTML_MAGIC_TYPES, HTML_PROF_TYPES, STAFF_PREFIXES ***REMOVED*** from './constants';

interface ForgeLevel {
  amount: number,
  baseMultiplier: number,
  scalingFactor: number
***REMOVED***

function titleStrToBase(title: string): number {
  return parseFloat(title.substr(6));
***REMOVED***

export function parseEquip(data: string): {
  name: string,
  level: string,
  info: string
***REMOVED*** {
  const $ = cheerio.load(data);

  // ===== Equipment Name =====
  let name = 'No such item';

  const $showequipEl = $('#showequip');
  let nameDiv;
  if ($showequipEl.length) {
    if ($showequipEl.children().length === 3) {
      nameDiv = $showequipEl.children().eq(0).children().eq(0);
    ***REMOVED*** else {
      nameDiv = $showequipEl.children().eq(1).children().eq(0);
    ***REMOVED***
    name = nameDiv.children().eq(0).text();
    if ($showequipEl.children().length === 3) {
      name += ` ${nameDiv.children().eq(2).text()***REMOVED***`;
    ***REMOVED***
  ***REMOVED***

  // ===== Equipment Level =====
  let level = 'Unknown';
  if (data.includes('Soulbound')) {
    level = 'Soulbound';
  ***REMOVED*** else {
    const matches = data.match(/Level\s([^\s]+)/);
    if (matches) {
      level = matches[1];
    ***REMOVED***
  ***REMOVED***

  let info = level;

  // ===== Equipment PXP =====
  function getPxp0(pxpN: number, n: number) {
    let pxp0Est = 300;
    for (let i = 1; i < 15; i++) {
      const sumPxpNextLevel = 1000 * ((1 + pxp0Est / 1000) ** (n + 1) - 1);
      const sumPxpThisLevel = 1000 * ((1 + pxp0Est / 1000) ** n - 1);
      const estimate = sumPxpNextLevel - sumPxpThisLevel;
      if (estimate > pxpN) { pxp0Est -= 300 / 2 ** i; ***REMOVED*** else { pxp0Est += 300 / 2 ** i; ***REMOVED***
    ***REMOVED***
    return Math.round(pxp0Est);
  ***REMOVED***

  let pxp0: number;
  const potencyMatches = data.match(/Potency\sTier:\s([^)]+\))/);
  if (potencyMatches) {
    const potencyStr = potencyMatches[1];

    if (potencyStr === '10 (MAX)') {
      info += ', IW 10';
      if (name.includes('Peerless')) {
        pxp0 = 400;
      ***REMOVED*** else if (name.includes('Legendary')) {
        pxp0 = 357;
      ***REMOVED*** else if (name.includes('Magnificent')) {
        pxp0 = 326;
      ***REMOVED*** else {
        pxp0 = 280;
      ***REMOVED***
    ***REMOVED*** else if (potencyStr[0] !== '0') {
      const matches = potencyStr.match(/\d+(?=\))/);
      if (matches) {
        pxp0 = getPxp0(parseInt(matches[0]), parseInt(potencyStr[0]));
      ***REMOVED***

      info += `, IW ${potencyStr[0]***REMOVED***`;
    ***REMOVED*** else {
      const matches = potencyStr.match(/(\d+)\)/);

      if (matches) {
        pxp0 = parseInt(matches[1]);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

  // ===== Equipment Forge =====
  let maxUpgrade = 0;
  const forging: Record<string, ForgeLevel> = {***REMOVED***;

  const forgeNameToHtmlName = (forgeName: string): {
    htmlName: string,
    baseMultiplier: number,
    scalingFactor: number
  ***REMOVED*** => {
    let htmlNameObj;
    EQUIP_STATS_NAMES.forEach((stats) => {
      if (forgeName === stats[1]) {
        htmlNameObj = {
          htmlName: stats[2], baseMultiplier: stats[3], scalingFactor: stats[4]
        ***REMOVED***;
      ***REMOVED***
    ***REMOVED***);
    return htmlNameObj || {
      htmlName: 'unknown',
      baseMultiplier: 0,
      scalingFactor: 1
    ***REMOVED***;
  ***REMOVED***;

  $('#eu > span').each((i, el) => {
    const matches = $(el).text().match(/(.+)\sLv\.(\d+)/);
    if (matches) {
      const thisUpgrade = Number(matches[2]);
      if (maxUpgrade < thisUpgrade) {
        maxUpgrade = thisUpgrade;
      ***REMOVED***
      const htmlNameObj = forgeNameToHtmlName(matches[1]);
      if (htmlNameObj) {
        forging[htmlNameObj.htmlName] = { amount: thisUpgrade, baseMultiplier: htmlNameObj.baseMultiplier, scalingFactor: htmlNameObj.scalingFactor ***REMOVED***;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***);

  const reverseForgeMultiplierDamage = (forgedBase: number, forgeLevelObj: ForgeLevel) => {
    const qualityBonus = 0.01 * Math.round(100 * (pxp0 - 100) / 25 * forgeLevelObj.baseMultiplier);
    const forgeCoeff = 1 + 0.278875 * Math.log(0.1 * forgeLevelObj.amount + 1);
    const unforgedBase = (forgedBase - qualityBonus) / forgeCoeff + qualityBonus;
    return unforgedBase;
  ***REMOVED***;
  const reverseForgeMultiplierPlain = (forgedBase: number, forgeLevelObj: ForgeLevel) => {
    const qualityBonus = 0.01 * Math.round(100 * (pxp0 - 100) / 25 * forgeLevelObj.baseMultiplier);
    const forgeCoeff = 1 + 0.2 * Math.log(0.1 * forgeLevelObj.amount + 1);
    const unforgedBase = (forgedBase - qualityBonus) / forgeCoeff + qualityBonus;
    return unforgedBase;
  ***REMOVED***;

  // ===== Equipment Info =====
  if (name.includes('Shield') || name.includes('Buckler')) {
    info += ',';

    if (data.includes('Strength')) {
      info += ' Str';
    ***REMOVED***
    if (data.includes('Dexterity')) {
      info += ' Dex';
    ***REMOVED***
    if (data.includes('Endurance')) {
      info += ' End';
    ***REMOVED***
    if (data.includes('Agility')) {
      info += ' Agi';
    ***REMOVED***
  ***REMOVED***

  if (maxUpgrade > 0) {
    info += `, forged ${maxUpgrade***REMOVED***`;
  ***REMOVED***

  const lower = name.toLowerCase();
  /* if (lower.includes('leather') || lower.includes('cotton') || lower.includes('protection') || lower.includes('warding')) {
    return {
      name,
      level,
      info
    ***REMOVED***;
  ***REMOVED*** */

  // ===== Parse Useful Equipment Infomation
  const equipStats: Record<string, number> = {***REMOVED***;

  $('div[title]').each((i, el) => {
    const title = $(el).attr('title');

    if ($(el).parent().parent().attr('id') === 'equip_extended' && title) {
      equipStats['Attack Damage'] = titleStrToBase(title);
      return;
    ***REMOVED***

    let htmlName = $($(el).prop('childNodes')[0]).text();

    if (htmlName.includes('+')) {
      htmlName = htmlName.substr(0, htmlName.length - 2);
    ***REMOVED***
    if (HTML_MAGIC_TYPES.includes(htmlName)) {
      if ($(el).parent().children().eq(0).text() === 'Damage Mitigations') {
        htmlName += ' Mit';
      ***REMOVED***
    ***REMOVED***

    if (title) {
      equipStats[htmlName] = titleStrToBase(title);
    ***REMOVED***
  ***REMOVED***);

  const abbrevNameToHtmlName = (abbrevName: string): string | undefined => {
    let htmlName;

    if (abbrevName === 'Prof') {
      Object.keys(equipStats).forEach((equipStatName) => {
        if (HTML_PROF_TYPES.includes(equipStatName)) htmlName = equipStatName;
      ***REMOVED***);
    ***REMOVED*** else if (abbrevName === 'EDB') {
      Object.keys(equipStats).forEach((equipStatName) => {
        if (HTML_MAGIC_TYPES.includes(equipStatName) && !name.includes('Staff')) {
          htmlName = equipStatName;
        ***REMOVED***
        if (HTML_MAGIC_TYPES.includes(equipStatName) && name.includes('Staff')) {
          if (name.includes(STAFF_PREFIXES[equipStatName as keyof typeof STAFF_PREFIXES
          ])) {
            htmlName = equipStatName;
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED*** else {
      EQUIP_STATS_NAMES.forEach((stats) => {
        if (abbrevName === stats[0]) {
          htmlName = stats[2];
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***

    return htmlName;
  ***REMOVED***;

  EQUIP_RANGES.forEach((range) => {
    if (!((range[3] as readonly string[]).every((subName: string) => lower.includes(subName)))) {
      return;
    ***REMOVED***
    if (range[4] && lower.includes(range[4][0])) {
      return;
    ***REMOVED***

    const abbrevName = range[0];
    const htmlName = abbrevNameToHtmlName(abbrevName);

    if (htmlName) {
      let stat = equipStats[htmlName];

      if (abbrevName === 'ADB' || abbrevName === 'MDB') {
        if (forging[htmlName]) { stat = reverseForgeMultiplierDamage(stat, forging[htmlName]); ***REMOVED***
      ***REMOVED*** else if (forging[htmlName]) { stat = reverseForgeMultiplierPlain(stat, forging[htmlName]); ***REMOVED***

      if (abbrevName === 'ADB') {
        const butcherMatches = data.match(/Butcher\sLv.(\d)/);
        if (butcherMatches) { stat = stat / (1 + 0.02 * parseInt(butcherMatches[1])); ***REMOVED***
      ***REMOVED*** else if (abbrevName === 'MDB') {
        const archmage = data.match(/Archmage\sLv.(\d)/);
        if (archmage) { stat = stat / (1 + 0.02 * parseInt(archmage[1])); ***REMOVED***
      ***REMOVED***

      if (stat) {
        const percentile = Math.round(100 * (stat - range[1]) / (range[2] - range[1]));
        info += `, ${range[0]***REMOVED*** ${percentile***REMOVED***%`;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***);

  return {
    name,
    level,
    info
  ***REMOVED***;
***REMOVED***

(() => {
  [
    'https://hentaiverse.org/equip/268325913/a916142cda',
    'https://hentaiverse.org/equip/268468677/df59bf55b2',
    'https://hentaiverse.org/equip/266315317/bff836b736',
    'https://hentaiverse.org/equip/256364687/3d089a1826',
    'https://hentaiverse.org/equip/127854639/a75e29eabc',
    'https://hentaiverse.org/equip/268028057/858adf0513'
  ].forEach(async url => {
    const body = await getPage(url, {
      headers: {
        Cookie: 'ipb_member_id=5768403; ipb_pass_hash=7dd3832115bccdb732fbc543321b6a06'
      ***REMOVED***
    ***REMOVED***);

    if (body) {
      const { name, info ***REMOVED*** = parseEquip(body);

      console.log(name, info);
    ***REMOVED***
  ***REMOVED***);
***REMOVED***)();
