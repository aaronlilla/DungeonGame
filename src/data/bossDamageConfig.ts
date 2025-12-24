/**
 * Boss Baseline Damage Configuration
 * 
 * These values represent the base auto-attack damage for bosses.
 * The actual DPS is calculated based on abilities, attack speed, and mechanics.
 * 
 * Bosses use these values as a reference for their base melee attacks between abilities.
 */

export const BOSS_BASE_DAMAGE: Record<string, number> = {
  // Early bosses (Tier 1) - 25-30 base damage
  'Vaelrix the Gilded Ruin': 30,
  'Morchant, Bell-Bearer of the Last Toll': 30,
  'Ulthraxis of the Hungering Quiet': 25,
  'Qel\'Thuun the Infinite Murmur': 25,
  
  // Mid bosses (Tier 2) - 30-35 base damage  
  'Thalos Grimmwake': 30,
  'Eidolon Kareth, the Unremembered': 35,
  'The Ashbound Regent': 35,
  'Sable Hierophant Malverin': 25, // Lower due to anti-healing focus
  
  // Late bosses (Tier 3) - 35-40 base damage
  'Xyra Noctyss, Widow of the Black Sun': 35,
  'Zha\'karoth, The Fold Between Stars': 30,
  'Voruun, Born of Unlight': 35,
  
  // Final bosses - 40-45 base damage
  'The Pale Confluence': 40,
  'Cenotaph Omega': 45,
  
  // Legendary/Special bosses - 40-50 base damage
  'Kaelthorne, He Who Will Not Fall': 40,
  'Nyxavel, Mouth of the Void Choir': 35,
  'Virexa, Blood-Archivist Eternal': 35,
  'The Spiral Witness': 40,
  'Ichorion, Dream-Leech Prime': 30,
  'Orryx of the Shattered Crown': 35
};

/**
 * Get the base damage for a boss, with fallback
 */
export function getBossBaseDamage(bossName: string): number {
  return BOSS_BASE_DAMAGE[bossName] || 30; // Default to 30 if not configured
}
