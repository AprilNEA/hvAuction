export const SHORT_SUMMARY_STATS_CONFIG = [
  {
    nameTests: [
      /axe/, /club/,
      /rapier/, /shortsword/,
      /wakizashi/, /estoc/,
      /longsword/, /mace/,
      /katana/
    ],
    statsToShow: ['ADB']
  ***REMOVED***,
  { nameTests: [/staff/], statsToShow: ['MDB'] ***REMOVED***,
  { nameTests: [/hallowed.+staff/], statsToShow: ['Holy EDB'] ***REMOVED***,
  { nameTests: [/demonic.+staff/], statsToShow: ['Dark EDB'] ***REMOVED***,
  { nameTests: [/tempestuous.+staff/], statsToShow: ['Wind EDB'] ***REMOVED***,
  { nameTests: [/shocking.+staff/], statsToShow: ['Elec EDB'] ***REMOVED***,
  { nameTests: [/arctic.+staff/], statsToShow: ['Cold EDB'] ***REMOVED***,
  { nameTests: [/fiery.+staff/], statsToShow: ['Fire EDB'] ***REMOVED***,
  { nameTests: [/\sshield\s/, /buckler/], statsToShow: ['BLK'] ***REMOVED***,
  {
    nameTests: [/cotton.+heaven-sent/],
    statsToShow: ['Divine Prof']
  ***REMOVED***,
  {
    nameTests: [/cotton.+demon-fiend/],
    statsToShow: ['Forb Prof']
  ***REMOVED***,
  {
    nameTests: [/cotton.+elementalist/],
    statsToShow: ['Elem Prof']
  ***REMOVED***,
  {
    nameTests: [/cotton.+curse-weaver/],
    statsToShow: ['Depr Prof']
  ***REMOVED***,
  {
    nameTests: [/cotton.+earth-walker/],
    statsToShow: ['Sup Prof']
  ***REMOVED***,
  { nameTests: [/phase.+heimdall/], statsToShow: ['Holy EDB'] ***REMOVED***,
  { nameTests: [/phase.+fenrir/], statsToShow: ['Dark EDB'] ***REMOVED***,
  { nameTests: [/phase.+freyr/], statsToShow: ['Wind EDB'] ***REMOVED***,
  { nameTests: [/phase.+mjolnir/], statsToShow: ['Elec EDB'] ***REMOVED***,
  { nameTests: [/phase.+niflheim/], statsToShow: ['Cold EDB'] ***REMOVED***,
  { nameTests: [/phase.+surtr/], statsToShow: ['Fire EDB'] ***REMOVED***,
  { nameTests: [/shade/], statsToShow: ['ADB'] ***REMOVED***,
  { nameTests: [/power/], statsToShow: ['ADB'] ***REMOVED***
];

export const EXTENDED_SUMMARY_STATS_CONFIG = [
  {
    nameTests: [/axe/, /club/],
    statsToShow: ['ADB', 'Str', 'Dex', 'Agi']
  ***REMOVED***,
  {
    nameTests: [/rapier/, /shortsword/, /wakizashi/],
    statsToShow: ['ADB', 'Parry', 'Str', 'Dex', 'Agi']
  ***REMOVED***,
  {
    nameTests: [/estoc/, /longsword/, /mace/, /katana/],
    statsToShow: ['ADB', 'Str', 'Dex', 'Agi']
  ***REMOVED***,
  { nameTests: [/staff/], statsToShow: ['MDB', 'Int', 'Wis'] ***REMOVED***,
  {
    nameTests: [/hallowed.+staff/],
    statsToShow: ['Holy EDB', 'Divine Prof']
  ***REMOVED***,
  {
    nameTests: [/demonic.+staff/],
    statsToShow: ['Dark EDB', 'Forb Prof']
  ***REMOVED***,
  {
    nameTests: [/tempestuous.+staff/],
    statsToShow: ['Wind EDB', 'Elem Prof']
  ***REMOVED***,
  {
    nameTests: [/shocking.+staff/],
    statsToShow: ['Elec EDB', 'Elem Prof']
  ***REMOVED***,
  {
    nameTests: [/arctic.+staff/],
    statsToShow: ['Cold EDB', 'Elem Prof']
  ***REMOVED***,
  {
    nameTests: [/fiery.+staff/],
    statsToShow: ['Fire EDB', 'Elem Prof']
  ***REMOVED***,
  {
    nameTests: [/staff/],
    statsToShow: ['Depr Prof', 'CR', 'Burden']
  ***REMOVED***,
  {
    nameTests: [/\sshield\s/, /buckler/],
    statsToShow: [
      'BLK', 'Pmit',
      'Mmit', 'Str',
      'Dex', 'End',
      'Agi', 'Crus',
      'Slas', 'Pier'
    ]
  ***REMOVED***,
  {
    nameTests: [/cotton.+heaven-sent/],
    statsToShow: ['Divine Prof']
  ***REMOVED***,
  {
    nameTests: [/cotton.+demon-fiend/],
    statsToShow: ['Forb Prof']
  ***REMOVED***,
  {
    nameTests: [/cotton.+elementalist/],
    statsToShow: ['Elem Prof']
  ***REMOVED***,
  {
    nameTests: [/cotton.+curse-weaver/],
    statsToShow: ['Depr Prof']
  ***REMOVED***,
  {
    nameTests: [/cotton.+earth-walker/],
    statsToShow: ['Sup Prof']
  ***REMOVED***,
  { nameTests: [/phase.+heimdall/], statsToShow: ['Holy EDB'] ***REMOVED***,
  { nameTests: [/phase.+fenrir/], statsToShow: ['Dark EDB'] ***REMOVED***,
  { nameTests: [/phase.+freyr/], statsToShow: ['Wind EDB'] ***REMOVED***,
  { nameTests: [/phase.+mjolnir/], statsToShow: ['Elec EDB'] ***REMOVED***,
  { nameTests: [/phase.+niflheim/], statsToShow: ['Cold EDB'] ***REMOVED***,
  { nameTests: [/phase.+surtr/], statsToShow: ['Fire EDB'] ***REMOVED***,
  {
    nameTests: [/cotton/, /phase/],
    statsToShow: [
      'MDB', 'Int',
      'Wis', 'Cast Speed',
      'Mag CD', 'Evd',
      'Agi', 'Pmit',
      'Mmit', 'Crus'
    ]
  ***REMOVED***,
  {
    nameTests: [/leather/, /shade/],
    statsToShow: [
      'ADB', 'Attack Speed',
      'Pmit', 'Mmit',
      'Evd', 'Res',
      'Str', 'Dex',
      'End', 'Agi',
      'Int', 'Wis',
      'Crus', 'Slas',
      'Pier'
    ]
  ***REMOVED***,
  { nameTests: [/leather/], statsToShow: ['Burden'] ***REMOVED***,
  { nameTests: [/leather/, /shade/], statsToShow: ['Interf'] ***REMOVED***,
  { nameTests: [/\splate/], statsToShow: ['BLK'] ***REMOVED***,
  { nameTests: [/power/], statsToShow: ['ADB'] ***REMOVED***,
  {
    nameTests: [/\splate/, /power/],
    statsToShow: [
      'Str', 'Dex',
      'End', 'Pmit',
      'Mmit', 'Phy CC',
      'Phy CD', 'Crus',
      'Slas', 'Pier',
      'Burden', 'Interf'
    ]
  ***REMOVED***
];

// const weightedValueConfig = [].map(line => ({ 'tag': line[0], 'nameTest': line[1], 'statsWeight': Object.entries(line[2]).map(entry => ({ 'name': entry[0], 'value': entry[1] ***REMOVED***)) ***REMOVED***));

// statNames: [abbreviated name, forging name, html name, base multiplier, level scaling factor]. Base multiplier is necessary for precise reverse forge calculations
export const EQUIPMENT_STAT_NAMES = [{ abbr: 'ADB', forgeName: 'Physical Damage', htmlName: 'Attack Damage', baseMultiplier: 0.0854, levelScalingFactor: 16.666666666666668 ***REMOVED***, { abbr: 'Phy CC', forgeName: 'Physical Crit Chance', htmlName: 'Attack Crit Chance', baseMultiplier: 0.0105, levelScalingFactor: 2000 ***REMOVED***, { abbr: 'Phy CD', forgeName: null, htmlName: 'Attack Crit Damage', baseMultiplier: 0.01, levelScalingFactor: null ***REMOVED***, { abbr: 'Phy ACC', forgeName: 'Physical Hit Chance', htmlName: 'Attack Accuracy', baseMultiplier: 0.06069, levelScalingFactor: 5000 ***REMOVED***, { abbr: 'Attack Speed', forgeName: null, htmlName: 'Attack Speed', baseMultiplier: 0.0481, levelScalingFactor: null ***REMOVED***, { abbr: 'MDB', forgeName: 'Magical Damage', htmlName: 'Magic Damage', baseMultiplier: 0.082969, levelScalingFactor: 22.727272727272727 ***REMOVED***, { abbr: 'Mag CC', forgeName: 'Magical Crit Chance', htmlName: 'Magic Crit Chance', baseMultiplier: 0.0114, levelScalingFactor: 2000 ***REMOVED***, { abbr: 'Mag CD', forgeName: null, htmlName: 'Spell Crit Damage', baseMultiplier: 0.01, levelScalingFactor: null ***REMOVED***, { abbr: 'Mag ACC', forgeName: 'Magical Hit Chance', htmlName: 'Magic Accuracy', baseMultiplier: 0.0491, levelScalingFactor: 5000 ***REMOVED***, { abbr: 'Cast Speed', forgeName: null, htmlName: 'Casting Speed', baseMultiplier: 0.0489, levelScalingFactor: null ***REMOVED***, { abbr: 'Str', forgeName: 'Strength Bonus', htmlName: 'Strength', baseMultiplier: 0.03, levelScalingFactor: 35.714285714285715 ***REMOVED***, { abbr: 'Dex', forgeName: 'Dexterity Bonus', htmlName: 'Dexterity', baseMultiplier: 0.03, levelScalingFactor: 35.714285714285715 ***REMOVED***, { abbr: 'End', forgeName: 'Endurance Bonus', htmlName: 'Endurance', baseMultiplier: 0.03, levelScalingFactor: 35.714285714285715 ***REMOVED***, { abbr: 'Agi', forgeName: 'Agility Bonus', htmlName: 'Agility', baseMultiplier: 0.03, levelScalingFactor: 35.714285714285715 ***REMOVED***, { abbr: 'Int', forgeName: 'Intelligence Bonus', htmlName: 'Intelligence', baseMultiplier: 0.03, levelScalingFactor: 35.714285714285715 ***REMOVED***, { abbr: 'Wis', forgeName: 'Wisdom Bonus', htmlName: 'Wisdom', baseMultiplier: 0.03, levelScalingFactor: 35.714285714285715 ***REMOVED***, { abbr: 'Evd', forgeName: 'Evade Chance', htmlName: 'Evade Chance', baseMultiplier: 0.025, levelScalingFactor: 2000 ***REMOVED***, { abbr: 'Res', forgeName: 'Resist Chance', htmlName: 'Resist Chance', baseMultiplier: 0.0804, levelScalingFactor: 2000 ***REMOVED***, { abbr: 'Pmit', forgeName: 'Physical Defense', htmlName: 'Physical Mitigation', baseMultiplier: 0.021, levelScalingFactor: 2000 ***REMOVED***, { abbr: 'Mmit', forgeName: 'Magical Defense', htmlName: 'Magical Mitigation', baseMultiplier: 0.0201, levelScalingFactor: 2000 ***REMOVED***, { abbr: 'BLK', forgeName: 'Block Chance', htmlName: 'Block Chance', baseMultiplier: 0.0998, levelScalingFactor: 2000 ***REMOVED***, { abbr: 'Parry', forgeName: 'Parry Chance', htmlName: 'Parry Chance', baseMultiplier: 0.0894, levelScalingFactor: 2000 ***REMOVED***, { abbr: 'Mana C', forgeName: null, htmlName: 'Mana Conservation', baseMultiplier: 0.1, levelScalingFactor: null ***REMOVED***, { abbr: 'Crus', forgeName: 'Crushing Mitigation', htmlName: 'Crushing', baseMultiplier: 0.0155, levelScalingFactor: null ***REMOVED***, { abbr: 'Slas', forgeName: 'Slashing Mitigation', htmlName: 'Slashing', baseMultiplier: 0.0153, levelScalingFactor: null ***REMOVED***, { abbr: 'Pier', forgeName: 'Piercing Mitigation', htmlName: 'Piercing', baseMultiplier: 0.015, levelScalingFactor: null ***REMOVED***, { abbr: 'Burden', forgeName: null, htmlName: 'Burden', baseMultiplier: 0, levelScalingFactor: null ***REMOVED***, { abbr: 'Interf', forgeName: null, htmlName: 'Interference', baseMultiplier: 0, levelScalingFactor: null ***REMOVED***, { abbr: 'Elem Prof', forgeName: 'Elemental Proficiency', htmlName: 'Elemental', baseMultiplier: 0.0306, levelScalingFactor: 35.714285714285715 ***REMOVED***, { abbr: 'Divine Prof', forgeName: 'Divine Proficiency', htmlName: 'Divine', baseMultiplier: 0.0306, levelScalingFactor: 35.714285714285715 ***REMOVED***, { abbr: 'Forb Prof', forgeName: 'Forbidden Proficiency', htmlName: 'Forbidden', baseMultiplier: 0.0306, levelScalingFactor: 35.714285714285715 ***REMOVED***, { abbr: 'Depr Prof', forgeName: 'Deprecating Proficiency', htmlName: 'Deprecating', baseMultiplier: 0.0306, levelScalingFactor: 35.714285714285715 ***REMOVED***, { abbr: 'Sup Prof', forgeName: 'Supportive Proficiency', htmlName: 'Supportive', baseMultiplier: 0.0306, levelScalingFactor: 35.714285714285715 ***REMOVED***, { abbr: 'Holy EDB', forgeName: 'Holy Spell Damage', htmlName: 'Holy EDB', baseMultiplier: 0.0804, levelScalingFactor: 200 ***REMOVED***, { abbr: 'Dark EDB', forgeName: 'Dark Spell Damage', htmlName: 'Dark EDB', baseMultiplier: 0.0804, levelScalingFactor: 200 ***REMOVED***, { abbr: 'Wind EDB', forgeName: 'Wind Spell Damage', htmlName: 'Wind EDB', baseMultiplier: 0.0804, levelScalingFactor: 200 ***REMOVED***, { abbr: 'Elec EDB', forgeName: 'Elec Spell Damage', htmlName: 'Elec EDB', baseMultiplier: 0.0804, levelScalingFactor: 200 ***REMOVED***, { abbr: 'Cold EDB', forgeName: 'Cold Spell Damage', htmlName: 'Cold EDB', baseMultiplier: 0.0804, levelScalingFactor: 200 ***REMOVED***, { abbr: 'Fire EDB', forgeName: 'Fire Spell Damage', htmlName: 'Fire EDB', baseMultiplier: 0.0804, levelScalingFactor: 200 ***REMOVED***, { abbr: 'Holy MIT', forgeName: 'Holy Mitigation', htmlName: 'Holy MIT', baseMultiplier: 0.1, levelScalingFactor: null ***REMOVED***, { abbr: 'Dark MIT', forgeName: 'Dark Mitigation', htmlName: 'Dark MIT', baseMultiplier: 0.1, levelScalingFactor: null ***REMOVED***, { abbr: 'Wind MIT', forgeName: 'Wind Mitigation', htmlName: 'Wind MIT', baseMultiplier: 0.1, levelScalingFactor: null ***REMOVED***, { abbr: 'Elec MIT', forgeName: 'Elec Mitigation', htmlName: 'Elec MIT', baseMultiplier: 0.1, levelScalingFactor: null ***REMOVED***, { abbr: 'Cold MIT', forgeName: 'Cold Mitigation', htmlName: 'Cold MIT', baseMultiplier: 0.1, levelScalingFactor: null ***REMOVED***, { abbr: 'Fire MIT', forgeName: 'Fire Mitigation', htmlName: 'Fire MIT', baseMultiplier: 0.1, levelScalingFactor: null ***REMOVED***, { abbr: 'CR', forgeName: null, htmlName: 'Counter-Resist', baseMultiplier: 0.1, levelScalingFactor: null ***REMOVED***];

export const PEERLESS_PXP = [
  ['axe', 375], ['club', 375], ['rapier', 377], ['shortsword', 377], ['wakizashi', 378], ['estoc', 377], ['katana', 375], ['longsword', 375], ['mace', 375], ['katalox staff', 368], ['oak staff', 371], ['redwood staff', 371], ['willow staff', 371], ['buckler', 374], ['force shield', 374], ['kite shield', 374], ['phase', 377], ['cotton', 377], ['arcanist', 421], ['shade', 394], ['leather', 393], ['power', 382], [' plate', 377]
] as const;

export const HTML_MAGIC_TYPES = ['Holy', 'Dark', 'Wind', 'Elec', 'Cold', 'Fire'];
export const HTML_PROF_TYPES = ['Divine', 'Forbidden', 'Elemental'];
export const STAFF_PREFIXES = { Holy: 'Hallowed', Dark: 'Demonic', Wind: 'Tempestuous', Elec: 'Shocking', Cold: 'Arctic', Fire: 'Fiery' ***REMOVED***;
export const EQUIPMENT_TYPES_WITH_SLOTS = ['Cotton', 'Phase', 'Leather', 'Shade', 'Plate', 'Power'];
