# Path of Exile Loot Filter Reference

## Implementation Based on NeverSink's Filter

This document shows how the game's loot system matches Path of Exile's loot filter design.

## PoE Filter Structure (from yes.filter)

### Example Filter Rules:

```
Show # 6-Link Items (High Value)
    LinkedSockets 6
    SetFontSize 45
    SetTextColor 255 255 255 255      # White text
    SetBorderColor 255 255 255 255    # White border
    SetBackgroundColor 200 0 0 255    # Red background
    PlayAlertSound 1 300
    PlayEffect Red                     # RED BEAM
    MinimapIcon 0 Red Diamond

Show # Gold (High Stack)
    StackSize >= 3001
    SetFontSize 45
    SetTextColor 235 200 110 255      # Gold text
    SetBorderColor 235 200 110 255    # Gold border
    SetBackgroundColor 20 20 0 255    # Dark background
    PlayAlertSound 2 300
    PlayEffect Orange                  # ORANGE BEAM
    MinimapIcon 1 Yellow Cross

Show # Magic Items
    Rarity Magic
    SetTextColor 136 136 255 255      # Blue text
    SetBorderColor 136 136 255 255    # Blue border
    PlayEffect Blue                    # BLUE BEAM

Show # Rare Items
    Rarity Rare
    SetTextColor 255 255 119 255      # Yellow text
    SetBorderColor 255 255 119 255    # Yellow border
    PlayEffect Yellow                  # YELLOW BEAM

Show # Unique Items
    Rarity Unique
    SetTextColor 175 96 37 255        # Orange/brown text
    SetBorderColor 175 96 37 255      # Orange/brown border
    PlayEffect Brown                   # BROWN/ORANGE BEAM

Show # Fragments
    SetTextColor 145 30 220 255       # Purple text
    SetBorderColor 145 30 220 255     # Purple border
    PlayEffect Purple                  # PURPLE BEAM
```

## Our Implementation Mapping

### Beam Colors (PlayEffect)
| PoE Effect | Our Color | RGB Values | Usage |
|-----------|-----------|------------|-------|
| White | White | `rgba(255, 255, 255, 0.25)` | Common items |
| Blue | Blue | `rgba(136, 136, 255, 0.5)` | Magic/Uncommon |
| Yellow | Yellow | `rgba(255, 255, 119, 0.6)` | Rare items, Maps |
| Brown/Orange | Orange | `rgba(175, 96, 37, 0.7)` | Unique/Epic |
| Purple | Purple | `rgba(179, 93, 255, 0.8)` | Legendary, Fragments |
| Orange | Orange | `rgba(235, 200, 110, 0.6)` | Currency/Orbs |
| Red | Red | N/A | Reserved for special items |
| Green | Green | N/A | Reserved for special items |
| Pink | Pink | N/A | Reserved for special items |

### Text Colors (SetTextColor)
| Rarity | Text Color | Border Color | Border Width |
|--------|-----------|--------------|--------------|
| Common | `#c8c8c8` | `#808080` | 1px |
| Magic | `#8888ff` | `#8888ff` | 2px |
| Rare | `#ffff77` | `#ffff77` | 2px |
| Unique | `#af6025` | `#af6025` | 2px |
| Legendary | `#b35dff` | `#b35dff` | 3px |
| Currency | `#ebc86e` | `#ebc86e` | 2px |
| Maps | `#d4af37` | `#d4af37` | 3px |
| Fragments | `#911ed4` | `#911ed4` | 2px |

### Background Colors (SetBackgroundColor)
All backgrounds use semi-transparent dark colors:
- Common: `rgba(30, 30, 30, 0.85)`
- Magic: `rgba(0, 20, 40, 0.9)`
- Rare: `rgba(20, 20, 0, 0.9)`
- Unique: `rgba(30, 15, 10, 0.9)`
- Legendary: `rgba(25, 10, 40, 0.95)`
- Currency: `rgba(20, 20, 0, 0.9)`
- Maps: `rgba(20, 20, 0, 0.95)`
- Fragments: `rgba(20, 10, 35, 0.9)`

### Font Sizes (SetFontSize)
| PoE Size | Our Size | Usage |
|----------|----------|-------|
| 45 | 0.8rem (bold 700) | High value items |
| 40 | 0.75rem | Medium value |
| 35 | 0.7rem | Low value |

### Sound Effects (PlayAlertSound)
| PoE Sound ID | Our Implementation | Usage |
|--------------|-------------------|-------|
| 1 | High-value sound | Rare+ items |
| 2 | Currency sound | Orbs |
| 3 | Medium sound | Magic items |
| 5 | Special sound | Fragments, Maps |

### Visual Effects Breakdown

#### Beam Structure (from bottom to top):
1. **Ground Glow** (60px radial)
   - Bright base that illuminates the ground
   - Pulsing animation (2s cycle)
   
2. **Outer Glow** (30px wide, 250px tall)
   - Soft, wide aura
   - Heavy blur (12px)
   - Creates atmospheric effect
   
3. **Main Beam** (12px wide, 300px tall)
   - Primary pillar of light
   - Medium blur (3px)
   - Core visual element
   
4. **Inner Core** (4px wide, 280px tall)
   - Bright center line
   - Light blur (1px)
   - Adds definition
   
5. **Shimmer Effect** (8px wide, 300px tall)
   - Traveling light pattern
   - Only on rare+ items
   - Creates movement

#### Beam Intensity Stacking:
- 1 item = 0.5 intensity
- 2 items nearby = 1.0 intensity (2x brightness)
- 3+ items nearby = 1.5 intensity (3x brightness, capped)

#### Animation Timings:
- Main pulse: 2.0s cycle
- Core pulse: 2.0s cycle (100ms offset)
- Glow pulse: 2.5s cycle (200ms offset)
- Shimmer: 3.0s linear loop
- Legendary sparkle: 1.5s linear loop

### Temp Beams (PlayEffect X Temp)
PoE uses "Temp" modifier for less important drops:
- 50% intensity reduction
- Same colors, just dimmer
- Used for lower-tier items of same type

## Key Design Principles

1. **Color Consistency**: Text, border, and beam all match
2. **Rarity Hierarchy**: Higher rarity = thicker borders, brighter beams
3. **Visual Clarity**: Strong shadows ensure readability
4. **Stacking Effect**: Multiple items = brighter combined beam
5. **Subtle Common**: White beams are faint to avoid spam
6. **Prominent Rare**: Yellow/Purple beams are vivid and eye-catching
7. **Audio Feedback**: Every drop has appropriate sound
8. **Performance**: Pure CSS animations, no JS loops

## Differences from PoE

### What We Match:
✅ Beam colors and effects
✅ Text and border colors
✅ Font styling and shadows
✅ Sound system
✅ Rarity hierarchy
✅ Temp beam concept

### What We Don't Have (Yet):
❌ Minimap icons
❌ Custom alert sounds (using synthesized)
❌ Font size variations by value
❌ Shape variations (Diamond, Circle, Square, etc.)
❌ Beam shapes beyond vertical pillars

### What We Enhanced:
✨ Beam stacking for multiple drops
✨ Smooth pulsing animations
✨ Shimmer effects for rare items
✨ Ground glow effects
✨ Hover interactions


