/**
 * List of boss names to randomly assign to gate bosses and final bosses
 */
export const BOSS_NAMES = [
  'Vaelrix the Gilded Ruin',
  'Morchant, Bell-Bearer of the Last Toll',
  'Xyra Noctyss, Widow of the Black Sun',
  'Thalos Grimmwake',
  'Eidolon Kareth, the Unremembered',
  'Sable Hierophant Malverin',
  'Orryx of the Shattered Crown',
  'Virexa, Blood-Archivist Eternal',
  'The Ashbound Regent',
  'Kaelthorne, He Who Will Not Fall',
  'Ulthraxis of the Hungering Quiet',
  'Nyxavel, Mouth of the Void Choir',
  "Zha'karoth, The Fold Between Stars",
  'The Pale Confluence',
  'Ichorion, Dream-Leech Prime',
  "Qel'Thuun the Infinite Murmur",
  'The Spiral Witness',
  'Voruun, Born of Unlight',
  'Cenotaph Omega'
];

/**
 * Randomly selects a boss name from the list
 * @param usedNames Optional set of names that have already been used (to avoid duplicates)
 * @returns A random boss name
 */
export function getRandomBossName(usedNames?: Set<string>): string {
  const availableNames = usedNames 
    ? BOSS_NAMES.filter(name => !usedNames.has(name))
    : BOSS_NAMES;
  
  // If all names are used, reset and allow duplicates
  if (availableNames.length === 0) {
    return BOSS_NAMES[Math.floor(Math.random() * BOSS_NAMES.length)];
  }
  
  return availableNames[Math.floor(Math.random() * availableNames.length)];
}

