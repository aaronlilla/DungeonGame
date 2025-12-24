# ⚔️ Mythic Delve

An infinite-scaling, dungeon-based auto-battler RPG inspired by World of Warcraft's Mythic+ system, Final Fantasy's materia, and Path of Exile's itemization and passive trees.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

## 🎮 Game Overview

### Core Features

- **Team Management**: Build a party of 5 characters, each defined by one of three roles (Tank, Healer, DPS)
- **Skill Gem System**: Equip skills like Final Fantasy's materia, with support gems that modify each skill
- **Passive Trees**: Role-specific talent webs similar to Path of Exile, offering stat boosts and keystone effects
- **PoE-Style Itemization**: Gear with random prefixes/suffixes, item levels, and a deep crafting system
- **MDT-Style Dungeon Planner**: Plan your dungeon route pack-by-pack before each run
- **Auto-Battle Simulation**: Combat resolves automatically based on your builds and route choices
- **Infinite Scaling**: Mythic+ style key levels that infinitely increase difficulty and rewards

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd mythic-delve

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:5173`

## 🎯 How to Play

### 1. Build Your Team
Navigate to the **Team** tab to manage your 5-character roster. Each character has a role:
- 🛡️ **Tank**: High health and armor, generates threat to protect allies
- 💚 **Healer**: Restores health to party members
- ⚔️ **DPS**: Deals damage to enemies

### 2. Equip Skills
In the **Skills** tab, equip skill gems to your characters. Each skill has:
- Support slots for modifications
- Mana cost, cooldown, and cast time
- Role restrictions (some skills are role-specific)

### 3. Allocate Passives
The **Passives** tab shows your role-specific talent tree. Allocate points to:
- Minor nodes for stat bonuses
- Notable nodes for significant effects
- Keystone nodes for build-defining mechanics

### 4. Gear Up
In the **Gear** tab:
- Equip items from your inventory
- Craft items using orbs (similar to Path of Exile)
- Items have rarities: Normal → Magic → Rare → Unique

### 5. Plan Your Route
The **Dungeon** tab features an MDT-style planner:
- Click enemy packs to select them
- Add selected packs as pulls to build your route
- Meet the required enemy forces count
- Plan optimal pull sizes and paths

### 6. Run the Dungeon
With your route planned:
- Select your key level
- Click "Start Dungeon Run"
- Watch the combat simulation
- Collect loot and progression!

## 🔧 Crafting System

| Orb | Effect |
|-----|--------|
| 🔵 Transmutation | Normal → Magic |
| 🔄 Alteration | Reroll magic affixes |
| ➕ Augmentation | Add affix to magic item |
| 🟡 Alchemy | Normal → Rare |
| 🌀 Chaos | Reroll rare affixes |
| ⭐ Exalted | Add affix to rare item |
| ✨ Divine | Reroll affix values |
| 🔴 Vaal | Corrupt (random outcome) |
| ❌ Annulment | Remove random affix |
| 🧹 Scouring | Remove all affixes |

## 🏆 Key Levels & Scaling

Each key level increases:
- Enemy health: +10% per level (exponential)
- Enemy damage: +8% per level (exponential)  
- Rewards: +15% per level (exponential)

Higher keys unlock additional dungeon affixes like Fortified, Tyrannical, Bolstering, and more.

## 🏗️ Project Structure

```
mythic-delve/
├── src/
│   ├── components/       # React UI components
│   │   ├── TeamTab.tsx
│   │   ├── SkillsTab.tsx
│   │   ├── GearTab.tsx
│   │   ├── PassivesTab.tsx
│   │   ├── DungeonTab.tsx
│   │   └── StashTab.tsx
│   ├── store/           # Zustand state management
│   │   └── gameStore.ts
│   ├── systems/         # Game logic
│   │   ├── crafting.ts
│   │   └── simulation.ts
│   ├── types/           # TypeScript definitions
│   │   ├── character.ts
│   │   ├── skills.ts
│   │   ├── items.ts
│   │   ├── dungeon.ts
│   │   └── passives.ts
│   ├── styles/          # CSS styles
│   │   └── main.css
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## 🎨 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Zustand** - State management with persistence
- **Immer** - Immutable state updates

## 🔮 Future Features

- [ ] More dungeons with unique mechanics
- [ ] Boss-specific loot tables
- [ ] Unique items with special effects
- [ ] Party buffs and synergies
- [ ] Leaderboards and achievements
- [ ] Import/export routes
- [ ] More skill gems and support combinations

## 📜 License

MIT

---

*May your keys be bountiful and your loot be legendary!* ⚔️

