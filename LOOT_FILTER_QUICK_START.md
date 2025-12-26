# Loot Filter System - Quick Start Guide

## 🎯 What Was Implemented

A complete Path of Exile style loot filter system that reads your `dada.filter` file and applies its exact rules to all loot drops in the game!

## 🚀 How to Use (3 Steps)

### 1. Open Filter Settings
Click the **🔍 button** in the bottom-left corner (next to the volume control)

### 2. Load Your Filter
1. Click **"Load Filter File"**
2. Select `dada.filter` from your Downloads folder
3. You'll see: "Loaded Filter: NeverSink's Indepth Loot Filter" with 728 rules

### 3. Enable It
Click the **"Enable Filter"** button - it will turn green!

## ✨ What It Does

Your NeverSink 3-STRICT PURPLE filter will now:

### ✅ Show Important Items
- **6-Link items** → White text, red background, RED BEAM
- **Valuable currency** (Exalted, Divine, etc.) → Red/Orange beams
- **High-tier maps** → Purple text, white background, RED BEAM
- **Good divination cards** → Tiered colors (blue/white/yellow)
- **Rare items** with good bases → Yellow text, yellow beam
- **Unique items** → Orange/brown text, orange beam

### ❌ Hide Junk
- Low-level normal items
- Outdated leveling gear
- Low-value magic items
- Worthless divination cards
- Scroll fragments

### 🎨 Apply Exact Filter Styles
- **Text colors** from your filter
- **Border colors** from your filter
- **Background colors** from your filter
- **Font sizes** from your filter (35-45px)
- **Beam effects** (Red, Blue, Yellow, Purple, Orange, White, Green, Pink)

## 📊 Filter Information

**Your Filter:**
- **Name:** NeverSink's Indepth Loot Filter
- **Version:** 8.18.2.2025.360.7
- **Type:** 3-STRICT (hides low-value items)
- **Style:** PURPLE
- **Rules:** 728 filter rules

## 🎮 Testing It

1. Go to **Maps** or **Dungeon** tab
2. Run a map/dungeon
3. Watch the loot drops:
   - High-value items will have **bright colors** and **beams**
   - Low-value items will be **hidden**
   - Currency will have **gold/orange** colors
   - Maps will have **purple/yellow** colors

## 🔧 Features

### What Works
✅ All 728 rules from your filter
✅ Show/Hide actions
✅ Rarity filtering (Normal, Magic, Rare, Unique)
✅ BaseType matching (specific item names)
✅ Class filtering (Weapons, Armour, Currency, Maps)
✅ ItemLevel ranges
✅ Quality filtering
✅ LinkedSockets (6-links!)
✅ StackSize (currency stacks)
✅ MapTier ranges
✅ All color styling (text, border, background)
✅ Font sizes
✅ Beam effects (PlayEffect)
✅ Sound alert tiers

### Filter Controls
- **Enable/Disable** toggle (keeps filter loaded)
- **Clear Filter** (removes filter completely)
- **Load Different Filter** (replace current filter)
- **Filter persists** across sessions (saved to localStorage)

## 📁 Files Created

### Core System
- `src/types/lootFilter.ts` - Type definitions
- `src/utils/lootFilterParser.ts` - Parses .filter files (728 rules!)
- `src/utils/lootFilterEngine.ts` - Evaluates items against rules
- `src/utils/lootFilterLoader.ts` - File loading utilities

### UI Components
- `src/components/ui/LootFilterSettings.tsx` - Settings modal
- Updated `src/components/dungeon/LootDrops.tsx` - Uses filter styles
- Updated `src/App.tsx` - Filter button and modal

### Game State
- Updated `src/store/gameStore.ts` - Filter state management

### Documentation
- `LOOT_FILTER_IMPLEMENTATION.md` - Technical documentation
- `USING_YOUR_FILTER.md` - Detailed user guide
- `LOOT_FILTER_QUICK_START.md` - This file!

## 🎨 Example Filter Rules

### 6-Link Items (Highest Priority)
```
Show
    LinkedSockets 6
    SetFontSize 45
    SetTextColor 255 255 255 255      # White
    SetBorderColor 255 255 255 255
    SetBackgroundColor 200 0 0 255    # Red
    PlayEffect Red                     # RED BEAM!
```

### Exalted Orbs
```
Show
    BaseType == "Exalted Orb"
    SetFontSize 45
    SetTextColor 255 255 255 255
    SetBackgroundColor 240 90 35 255
    PlayEffect Red
```

### High-Tier Maps
```
Show
    MapTier >= 14
    SetFontSize 45
    SetTextColor 100 0 122 255       # Purple
    SetBackgroundColor 255 255 255 255
    PlayEffect Red
```

## 💡 Tips

1. **Red beams = most valuable** - always check these!
2. **Yellow beams = high value** - good items
3. **Blue beams = magic items** - moderate value
4. **Purple beams = fragments** - special items
5. **Orange beams = currency** - always useful

## 🔄 Changing Filters

Want to try different strictness levels?
1. Go to https://www.filterblade.xyz
2. Download different versions:
   - **Soft** - Shows almost everything
   - **Regular** - Balanced
   - **Semi-Strict** - Hides some junk
   - **Strict** - Your current filter (3-STRICT)
   - **Very Strict** - Hides more
   - **Uber Strict** - Only valuable items
3. Load the new filter in-game

## ❓ Troubleshooting

**Filter not working?**
- Make sure it's **enabled** (green button)
- Check for errors in the settings modal
- Try reloading the filter

**Too many items hidden?**
- Your filter is strict (3-STRICT)
- Try a more lenient version (Regular or Soft)

**Want to see all items temporarily?**
- Click "Enable Filter" to disable it
- All items will show with default colors
- Click again to re-enable

## 🎉 Enjoy!

Your loot drops now have the **exact same styling** as Path of Exile with your NeverSink filter!

- Beautiful color-coded items
- Prominent beams for valuable drops
- Hidden junk items
- Professional-grade loot filtering

Happy farming! 🎯✨


