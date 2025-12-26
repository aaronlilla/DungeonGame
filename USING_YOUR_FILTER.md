# Using Your NeverSink Filter (dada.filter)

## Quick Start

Your `dada.filter` file is a **NeverSink 3-STRICT filter with PURPLE style** (version 8.18.2.2025.360.7). Here's how to use it in the game:

### Step 1: Load the Filter

1. Launch the game
2. Click the **filter button (🔍)** in the bottom-left corner (next to volume control)
3. Click **"Load Filter File"**
4. Select your `dada.filter` file from Downloads
5. You'll see the filter information displayed:
   - **Name:** NeverSink's Indepth Loot Filter
   - **Version:** 8.18.2.2025.360.7
   - **Type:** 3-STRICT
   - **Style:** PURPLE
   - **Rules:** 728 filter rules loaded

### Step 2: Enable the Filter

1. Click the **"Enable Filter"** button
2. The filter is now active!
3. All loot drops will now follow your filter rules

### Step 3: Test It Out

1. Go to the **Dungeon** or **Maps** tab
2. Run a dungeon/map
3. Watch the loot drops - they'll now use your filter's:
   - **Colors** - Items will have the exact colors from your filter
   - **Visibility** - Low-value items will be hidden
   - **Beam Effects** - High-value items will have special beam colors
   - **Text Sizes** - Important items will be larger

## What Your Filter Does

### Strictness Level: 3-STRICT

This is a **strict filter** that:
- ✅ Shows valuable items with prominent styling
- ✅ Shows currency (orbs) with appropriate colors
- ✅ Shows maps and fragments
- ✅ Shows rare items with good bases
- ✅ Shows unique items
- ❌ Hides most low-value normal items
- ❌ Hides low-tier magic items
- ❌ Hides outdated leveling items

### Style: PURPLE

Your filter uses the **PURPLE color scheme**:
- High-value items: Red/White backgrounds
- Currency: Gold/Orange colors
- Maps: Yellow/Gold colors
- Fragments: Purple colors
- Magic items: Blue colors
- Rare items: Yellow colors
- Unique items: Orange/Brown colors

### Key Filter Rules (Examples from your filter):

#### 6-Link Items (Highest Priority)
```
Show # 6-Link Items
    LinkedSockets 6
    SetFontSize 45
    SetTextColor 255 255 255 255      # White
    SetBorderColor 255 255 255 255
    SetBackgroundColor 200 0 0 255    # Red background
    PlayAlertSound 1 300
    PlayEffect Red                     # RED BEAM
```
**Result:** 6-link items will have white text, red background, and a red beam!

#### High-Value Currency
```
Show # Exalted Orbs, Divine Orbs, etc.
    SetFontSize 45
    SetTextColor 255 255 255 255
    SetBackgroundColor 240 90 35 255
    PlayEffect Red
```
**Result:** Valuable currency will be very visible with red beams!

#### Maps
```
Show # High-tier Maps
    MapTier >= 14
    SetFontSize 45
    SetTextColor 100 0 122 255       # Purple
    SetBorderColor 100 0 122 255
    SetBackgroundColor 255 255 255 255
    PlayEffect Red
```
**Result:** High-tier maps will be extremely visible!

#### Divination Cards (Tiered)
- **Tier 1 Cards:** Blue text, white background, red beam
- **Tier 2 Cards:** White text, blue background, red beam
- **Tier 3 Cards:** Purple text, cyan background, yellow beam
- **Tier 4 Cards:** Purple text, blue background, white beam
- **Tier 5 Cards:** Hidden (low value)

## Customizing the Filter

### Option 1: Use FilterBlade (Recommended)
1. Go to https://www.filterblade.xyz
2. Upload your `dada.filter` file
3. Customize colors, strictness, and rules
4. Download the modified filter
5. Load it in the game

### Option 2: Edit Manually
1. Open `dada.filter` in a text editor
2. Find the rule you want to change
3. Modify colors, sizes, or conditions
4. Save the file
5. Reload it in the game

### Example: Make All Rare Items More Visible
Find lines like:
```
Show # Rare Items
    Rarity Rare
    SetFontSize 40
    SetTextColor 255 255 119 255
```

Change to:
```
Show # Rare Items
    Rarity Rare
    SetFontSize 45              # Larger!
    SetTextColor 255 255 255 255  # Brighter white!
    PlayEffect Yellow           # Add beam!
```

## Troubleshooting

### Filter Not Working?
1. Make sure filter is **enabled** (green button)
2. Check that filter loaded successfully (no errors)
3. Try disabling and re-enabling
4. Reload the filter file

### Too Many/Too Few Items Showing?
- **Too many items:** Your filter might be too lenient
  - Try a stricter version (4-STRICT, 5-VERY-STRICT)
  - Get it from FilterBlade.xyz
- **Too few items:** Your filter might be too strict
  - Try a more lenient version (2-REGULAR, 1-SOFT)

### Colors Don't Match?
- The game converts PoE filter colors to RGBA
- Some colors might look slightly different
- This is normal and expected

### Want Different Beam Colors?
Edit the `PlayEffect` lines in your filter:
- `PlayEffect Red` - Red beam (highest value)
- `PlayEffect Yellow` - Yellow beam (high value)
- `PlayEffect Blue` - Blue beam (magic items)
- `PlayEffect Purple` - Purple beam (fragments)
- `PlayEffect Orange` - Orange beam (currency)
- `PlayEffect White` - White beam (common)
- `PlayEffect Green` - Green beam (special)
- `PlayEffect Pink` - Pink beam (very special)

## Advanced Usage

### Multiple Filters
You can have multiple filter files for different purposes:
- **Strict filter** for endgame farming
- **Lenient filter** for leveling
- **Currency-only filter** for quick farming
- **Unique-hunting filter** for finding specific items

Just load whichever one you want to use!

### Filter Profiles
Create custom filters for different scenarios:
- `mapping.filter` - For running maps
- `leveling.filter` - For leveling characters
- `boss-farming.filter` - For farming bosses
- `currency-farming.filter` - For currency runs

## Tips

1. **Start with the filter enabled** to see how it works
2. **Adjust strictness** based on your needs
3. **Pay attention to beam colors** - they indicate value!
4. **Red beams = very valuable** - always check these items
5. **Hidden items are still collected** if you walk over them
6. **Disable filter temporarily** to see all drops

## Getting More Filters

### NeverSink's Filters
- Website: https://www.filterblade.xyz
- Versions: Soft, Regular, Semi-Strict, Strict, Very Strict, Uber Strict
- Styles: Default, Purple, Blue, Green, Pink, Vaal, Slick, etc.

### Custom Filters
- Create your own on FilterBlade
- Share filters with friends
- Download community filters

## Support

If you have issues:
1. Check the filter loaded correctly (shows 728 rules)
2. Make sure it's enabled (green button)
3. Try reloading the filter
4. Check the console for errors (F12 in browser)

Enjoy your perfectly filtered loot! 🎯


