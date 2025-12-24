// Tag color mapping for dark fantasy theme
// Used for skill tags, support gem requirements, and ability displays
// Colors are muted and desaturated for a more elegant look

export function getTagColor(tag: string): string {
  const tagColors: Record<string, string> = {
    // Damage types - muted, darker
    fire: 'linear-gradient(135deg, #9c3a3a 0%, #6b2020 100%)',
    cold: 'linear-gradient(135deg, #3a7a9c 0%, #1e4a5c 100%)',
    lightning: 'linear-gradient(135deg, #a89030 0%, #6b5a18 100%)',
    chaos: 'linear-gradient(135deg, #6b4a8c 0%, #3d2a52 100%)',
    physical: 'linear-gradient(135deg, #5c5650 0%, #3a3632 100%)',
    holy: 'linear-gradient(135deg, #b8982a 0%, #7a6420 100%)',
    nature: 'linear-gradient(135deg, #3a8c4a 0%, #245830 100%)',
    arcane: 'linear-gradient(135deg, #7a4a9c 0%, #4a2a60 100%)',
    
    // Skill types - muted
    spell: 'linear-gradient(135deg, #4a5090 0%, #2e3260 100%)',
    attack: 'linear-gradient(135deg, #9c4040 0%, #602828 100%)',
    melee: 'linear-gradient(135deg, #9c6030 0%, #603a1c 100%)',
    projectile: 'linear-gradient(135deg, #308090 0%, #1c4a58 100%)',
    aoe: 'linear-gradient(135deg, #904a6a 0%, #582a40 100%)',
    chaining: 'linear-gradient(135deg, #308070 0%, #1c4a44 100%)',
    channelling: 'linear-gradient(135deg, #604a8c 0%, #3a2a58 100%)',
    ranged: 'linear-gradient(135deg, #408a9c 0%, #285660 100%)',
    
    // Effect types - muted
    hit: 'linear-gradient(135deg, #9c4050 0%, #602830 100%)',
    dot: 'linear-gradient(135deg, #608c30 0%, #3a581c 100%)',
    duration: 'linear-gradient(135deg, #4060a0 0%, #283a68 100%)',
    heal: 'linear-gradient(135deg, #308c60 0%, #1c583a 100%)',
    buff: 'linear-gradient(135deg, #3878a0 0%, #204a68 100%)',
    curse: 'linear-gradient(135deg, #6c3070 0%, #401c44 100%)',
    hot: 'linear-gradient(135deg, #308890 0%, #1c5058 100%)',
    
    // Mechanic types - muted
    elemental: 'linear-gradient(135deg, #9c7030 0%, #60441c 100%)',
    strike: 'linear-gradient(135deg, #8c3030 0%, #501c1c 100%)',
    slam: 'linear-gradient(135deg, #6c4020 0%, #402814 100%)',
    warcry: 'linear-gradient(135deg, #8c3030 0%, #501c1c 100%)',
    guard: 'linear-gradient(135deg, #304890 0%, #1c2c58 100%)',
    block: 'linear-gradient(135deg, #505860 0%, #30383c 100%)',
    stance: 'linear-gradient(135deg, #287050 0%, #184430 100%)',
    taunt: 'linear-gradient(135deg, #9c5020 0%, #603014 100%)',
    dispel: 'linear-gradient(135deg, #8050a0 0%, #503068 100%)',
    instant: 'linear-gradient(135deg, #a08820 0%, #685814 100%)',
    defensive: 'linear-gradient(135deg, #2860a0 0%, #183a68 100%)',
    'single-target': 'linear-gradient(135deg, #9c5830 0%, #60381c 100%)',
  };
  
  return tagColors[tag.toLowerCase()] || 'linear-gradient(135deg, #484848 0%, #2c2c2c 100%)';
}

// Get a solid color for simpler displays - muted versions
export function getTagSolidColor(tag: string): string {
  const tagColors: Record<string, string> = {
    // Damage types
    fire: '#9c3a3a',
    cold: '#3a7a9c',
    lightning: '#a89030',
    chaos: '#6b4a8c',
    physical: '#5c5650',
    holy: '#b8982a',
    nature: '#3a8c4a',
    arcane: '#7a4a9c',
    
    // Skill types
    spell: '#4a5090',
    attack: '#9c4040',
    melee: '#9c6030',
    projectile: '#308090',
    aoe: '#904a6a',
    chaining: '#308070',
    channelling: '#604a8c',
    ranged: '#408a9c',
    
    // Effect types
    hit: '#9c4050',
    dot: '#608c30',
    duration: '#4060a0',
    heal: '#308c60',
    buff: '#3878a0',
    curse: '#6c3070',
    hot: '#308890',
    
    // Mechanic types
    elemental: '#9c7030',
    strike: '#8c3030',
    slam: '#6c4020',
    warcry: '#8c3030',
    guard: '#304890',
    block: '#505860',
    stance: '#287050',
    taunt: '#9c5020',
    dispel: '#8050a0',
    instant: '#a08820',
    defensive: '#2860a0',
    'single-target': '#9c5830',
  };
  
  return tagColors[tag.toLowerCase()] || '#484848';
}
