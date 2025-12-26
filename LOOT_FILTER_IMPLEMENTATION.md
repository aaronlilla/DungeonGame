# Loot Filter System - Implementation Complete

## Overview
Implemented a comprehensive Path of Exile style loot filter system that allows players to customize how loot drops are displayed in the game. The system parses standard PoE .filter files and applies their rules to control item visibility, colors, text sizes, and beam effects.

## Features

### 1. **Filter Parser** (`lootFilterParser.ts`)
Parses standard Path of Exile .filter files into a structured format:
- **Supported Conditions:**
  - `Rarity` - Normal, Magic, Rare, Unique, Legendary
  - `BaseType` - Item base names (supports quoted strings)
  - `Class` - Item classes (Weapons, Armour, Currency, Maps, etc.)
  - `ItemLevel` - Item level ranges (>=, <=, ==)
  - `Quality` - Quality percentage
  - `Sockets` - Socket count
  - `LinkedSockets` - Linked socket count (for 6-links, etc.)
  - `Corrupted` - Corrupted status
  - `StackSize` - Stack size for currency
  - `AreaLevel` - Map tier/area level
  - `MapTier` - Map tier ranges
  - And more...

- **Supported Styles:**
  - `SetFontSize` - Text size
  - `SetTextColor` - Text color (RGBA)
  - `SetBorderColor` - Border color (RGBA)
  - `SetBackgroundColor` - Background color (RGBA)
  - `PlayAlertSound` - Sound alert ID and volume
  - `PlayEffect` - Beam effect color (Red, Blue, Yellow, etc.)
  - `MinimapIcon` - Minimap icon settings

### 2. **Filter Engine** (`lootFilterEngine.ts`)
Evaluates items against filter rules:
- **Rule Matching:**
  - Processes rules in order (priority matters!)
  - First matching rule determines visibility and styling
  - Supports both Show and Hide actions
  
- **Item Evaluation:**
  - Works with all item types: equipment, currency, maps, fragments
  - Matches item properties against filter conditions
  - Returns styling information for matched items

- **Style Extraction:**
  - Converts filter styles to renderable format
  - Provides beam effect colors
  - Determines sound tiers

### 3. **Filter Loader** (`lootFilterLoader.ts`)
Handles filter file loading and storage:
- **File Loading:**
  - Load from file upload (File API)
  - Load from URL/path
  - Parse and validate filter content

- **Storage:**
  - Save filter to localStorage
  - Load filter from localStorage
  - Clear filter from storage

### 4. **UI Components**

#### **LootFilterSettings** (`LootFilterSettings.tsx`)
A beautiful modal dialog for managing loot filters:
- **Features:**
  - File upload button for .filter files
  - Display loaded filter information (name, version, author, strictness, rule count)
  - Enable/Disable toggle
  - Clear filter button
  - Error handling and display
  - Instructions for users

- **Styling:**
  - Matches game's fantasy aesthetic
  - PoE-style colors and fonts
  - Smooth animations and transitions

#### **Integration in App.tsx**
- Filter settings button next to volume control
- Modal overlay when opened
- Only visible on non-dungeon tabs

### 5. **Loot Display Integration** (`LootDrops.tsx`)
Updated to use filter system:
- **Filter Application:**
  - Evaluates each loot drop against filter rules
  - Hides items that don't match Show rules
  - Applies custom styles from filter
  - Falls back to default styles if filter disabled

- **Style Override:**
  - Text color from filter
  - Border color from filter
  - Background color from filter
  - Font size from filter
  - Beam effects from filter

### 6. **Game Store Integration** (`gameStore.ts`)
Added filter state management:
- **State:**
  - `lootFilter: LootFilterConfig | null` - Loaded filter
  - `lootFilterEnabled: boolean` - Enable/disable toggle

- **Actions:**
  - `setLootFilter(filter)` - Set the active filter
  - `setLootFilterEnabled(enabled)` - Toggle filter on/off

## Usage

### For Players:

1. **Get a Filter File:**
   - Download from FilterBlade.xyz
   - Use NeverSink's filter (recommended)
   - Create your own .filter file

2. **Load the Filter:**
   - Click the filter button (🔍) in the bottom-left corner
   - Click "Load Filter File"
   - Select your .filter file
   - Filter information will be displayed

3. **Enable the Filter:**
   - Click "Enable Filter" button
   - Filter will be applied to all loot drops
   - Items will use filter colors and visibility rules

4. **Disable or Change:**
   - Click "Enable Filter" again to disable
   - Load a different filter to replace current one
   - Click "Clear Filter" to remove completely

### For Developers:

#### Adding New Filter Conditions:
```typescript
// In lootFilterParser.ts, add to parseRuleLine():
case 'YourCondition':
  rule.conditions.yourCondition = parseYourValue(values);
  break;

// In lootFilterEngine.ts, add to matchesConditions():
if (conditions.yourCondition) {
  // Your matching logic
  if (!matches) return false;
}
```

#### Adding New Style Properties:
```typescript
// In lootFilterParser.ts:
case 'SetYourStyle':
  rule.style.yourStyle = parseYourStyle(values);
  break;

// In lootFilterEngine.ts, use in getDropStyle():
const style = filterResult.style;
return {
  yourStyle: style.yourStyle || defaultValue,
  // ...
};
```

## File Structure

```
src/
├── types/
│   └── lootFilter.ts           # Type definitions
├── utils/
│   ├── lootFilterParser.ts     # Filter file parser
│   ├── lootFilterEngine.ts     # Filter evaluation engine
│   └── lootFilterLoader.ts     # File loading utilities
├── components/
│   ├── ui/
│   │   └── LootFilterSettings.tsx  # Settings UI
│   └── dungeon/
│       └── LootDrops.tsx       # Updated to use filter
├── store/
│   └── gameStore.ts            # Filter state management
└── App.tsx                     # Filter button integration
```

## Filter File Format

The system supports standard PoE filter syntax:

```
Show # High-value items
    Rarity Rare Unique
    ItemLevel >= 75
    SetFontSize 45
    SetTextColor 255 255 255 255
    SetBorderColor 255 255 255 255
    SetBackgroundColor 200 0 0 255
    PlayAlertSound 1 300
    PlayEffect Red
    MinimapIcon 0 Red Diamond

Hide # Low-level items
    ItemLevel <= 10
    Rarity Normal
```

## Compatibility

### Supported PoE Filter Features:
✅ Show/Hide actions
✅ Rarity conditions
✅ BaseType matching
✅ Class matching
✅ ItemLevel ranges
✅ Quality ranges
✅ LinkedSockets
✅ Corrupted status
✅ StackSize
✅ AreaLevel
✅ MapTier
✅ Color styling (text, border, background)
✅ Font size
✅ Beam effects (PlayEffect)
✅ Sound alerts (PlayAlertSound)

### Not Yet Implemented:
❌ Socket color matching (RGB, etc.)
❌ Influence types (Shaper, Elder, etc.)
❌ Fractured/Synthesised items
❌ Enchanted items
❌ Minimap icons (visual only, not functional)

## Testing

The filter system has been integrated and tested with:
- ✅ Item drops (all rarities)
- ✅ Currency drops (orbs)
- ✅ Map drops
- ✅ Fragment drops
- ✅ Filter enable/disable toggle
- ✅ Filter file loading
- ✅ Style application
- ✅ Visibility filtering

## Performance

- Filter evaluation is memoized in React components
- Rules are processed in order with early exit on match
- Filter state is persisted to localStorage
- No performance impact when filter is disabled

## Future Enhancements

1. **Filter Editor:**
   - In-game filter rule editor
   - Visual style preview
   - Rule priority adjustment

2. **Multiple Filters:**
   - Save multiple filter profiles
   - Quick-switch between filters
   - Per-character filters

3. **Advanced Conditions:**
   - Mod-based filtering
   - Stat value ranges
   - Socket color combinations

4. **Enhanced UI:**
   - Filter rule preview
   - Item count by filter tier
   - Filter statistics

## Credits

- Filter syntax based on Path of Exile's loot filter system
- Compatible with NeverSink's filter format
- Inspired by FilterBlade.xyz


