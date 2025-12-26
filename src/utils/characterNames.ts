/**
 * Generates a random unique name for characters
 * Uses fantasy-style first and last names
 */
export function generateRandomCharacterName(): string {
  const firstNames = [
    'Aelric', 'Brenna', 'Cedric', 'Dara', 'Eldric', 'Fara', 'Gareth', 'Hilda',
    'Ivor', 'Jenna', 'Kael', 'Lira', 'Marek', 'Nora', 'Orin', 'Phaedra',
    'Quinn', 'Rhea', 'Soren', 'Tara', 'Ulric', 'Vera', 'Wynn', 'Xara',
    'Yorick', 'Zara', 'Aldric', 'Bryn', 'Cora', 'Dorian', 'Elara', 'Finn',
    'Gwen', 'Haven', 'Iris', 'Jax', 'Kira', 'Lysander', 'Mira', 'Nyx',
    'Orion', 'Piper', 'Quinn', 'Raven', 'Silas', 'Thora', 'Ursa', 'Vex',
    'Wren', 'Xander', 'Yara', 'Zephyr', 'Aria', 'Blake', 'Cyrus', 'Diana',
    'Echo', 'Frey', 'Gale', 'Haven', 'Ivy', 'Jade', 'Kai', 'Luna',
    'Maya', 'Nova', 'Onyx', 'Phoenix', 'Quill', 'Rune', 'Sage', 'Terra',
    'Vale', 'Willow', 'Xara', 'Yuki', 'Zara'
  ];

  const lastNames = [
    'Shadowbane', 'Ironheart', 'Stormcaller', 'Frostweaver', 'Dawnbreaker',
    'Nightwhisper', 'Starfire', 'Moonblade', 'Thunderstrike', 'Flameborn',
    'Voidwalker', 'Lightbringer', 'Darkbane', 'Silverwind', 'Goldenshield',
    'Bloodthorn', 'Soulforge', 'Mindweaver', 'Spellbreaker', 'Dragonheart',
    'Wolfbane', 'Eaglewing', 'Bearclaw', 'Lionmane', 'Serpentstrike',
    'Phoenixfire', 'Ravenshadow', 'Crowfeather', 'Hawkseye', 'Falconwing',
    'Stonebreaker', 'Ironforge', 'Steelheart', 'Copperblade', 'Bronzefist',
    'Crystalweaver', 'Emeraldguard', 'Rubyflame', 'Sapphirefrost', 'Diamondedge',
    'Wildwood', 'Thornbush', 'Oakheart', 'Birchleaf', 'Pinecone',
    'Riverstone', 'Mountainpeak', 'Valleydeep', 'Forestglade', 'Seashore',
    'Windrider', 'Stormchaser', 'Cloudwalker', 'Skywatcher', 'Starfall'
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
}





