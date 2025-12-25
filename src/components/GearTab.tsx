import { useState, useCallback, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { CharacterSelector } from './shared/CharacterSelector';
import { GearSlots } from './gear/GearSlots';
import { InventoryPanel } from './gear/InventoryPanel';
import { getItemSlot, getItemGridSize, type GearSlot } from '../types/items';
import { buildOccupancyGrid, canPlaceItem } from '../utils/gridUtils';
import { validateEquipment, isOffHandWeapon, isShield, isTwoHandedWeapon } from '../utils/equipmentValidation';
import { calculateTotalCharacterStats } from '../systems/equipmentStats';

export function GearTab() {
  const { 
    team, 
    selectedCharacterId,
    selectCharacter, 
    inventory,
    equipItem,
    unequipItem,
    stashTabs,
    activeStashTabId,
    addItemToStash,
  } = useGameStore();

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  // Lifted held item state for cross-component dragging (stash <-> equipment)
  const [heldItemId, setHeldItemId] = useState<string | null>(null);
  const [heldItemSourceTabId, setHeldItemSourceTabId] = useState<string | null>(null);

  const selectedCharacter = team.find(c => c.id === selectedCharacterId);
  const activeTab = stashTabs.find(t => t.id === activeStashTabId) ?? stashTabs[0];
  
  // Calculate total character stats (including equipment) for requirement checking
  const totalStats = useMemo(() => {
    if (!selectedCharacter) return null;
    return calculateTotalCharacterStats(selectedCharacter, inventory);
  }, [selectedCharacter, inventory]);
  
  // Handle equipping a held item to a slot (for click-to-pickup workflow)
  const handleEquipHeldItem = useCallback((slot: GearSlot) => {
    if (!heldItemId || !selectedCharacter) return;
    
    const item = inventory.find(i => i.id === heldItemId);
    if (!item) return;
    
    // Validate the item can go in this slot
    let itemSlot = getItemSlot(item);
    if (!itemSlot) return;
    
    // Handle rings - they can go in either ring slot
    const isRingSlot = slot === 'ring1' || slot === 'ring2';
    const isRingItem = itemSlot === 'ring1' || itemSlot === 'ring2';
    let isValidSlot = false;
    
    if (isRingSlot && isRingItem) {
      isValidSlot = true;
    } else {
      // Handle one-handed weapons and shields - they can go in either mainHand or offHand
      const isWeaponSlot = slot === 'mainHand' || slot === 'offHand';
      const isWeaponItem = itemSlot === 'mainHand' || itemSlot === 'offHand';
      if (isWeaponSlot && isWeaponItem) {
        // One-handed weapons and shields can go in either slot
        if (isOffHandWeapon(item) || isShield(item)) {
          isValidSlot = true;
        } else if (slot === 'mainHand' && isTwoHandedWeapon(item)) {
          // Two-handers can only go in mainHand
          isValidSlot = true;
        }
      } else if (itemSlot === slot) {
        isValidSlot = true;
      }
    }
    
    if (!isValidSlot) return;
    
    // Get current equipment for validation
    const mainHandId = selectedCharacter.equippedGear.mainHand;
    const offHandId = selectedCharacter.equippedGear.offHand;
    const mainHand = mainHandId ? inventory.find(i => i.id === mainHandId) : null;
    const offHand = offHandId ? inventory.find(i => i.id === offHandId) : null;
    
    // Validate equipment rules (2H, bow/quiver, etc.) BEFORE making any changes
    const validation = validateEquipment(item, slot, mainHand || null, offHand || null);
    if (!validation.canEquip) {
      console.warn(`Cannot equip ${item.name} to ${slot}: ${validation.reason}`);
      return; // Don't proceed if validation fails
    }
    
    // Get any item currently in the slot BEFORE equipping
    const existingItemId = selectedCharacter.equippedGear[slot];
    const existingItem = existingItemId ? inventory.find(i => i.id === existingItemId) : null;
    
    // Equip the held item (validation already passed, so this should succeed)
    equipItem(selectedCharacter.id, slot, heldItemId);
    
    // If there was an existing item, pick it up onto cursor
    if (existingItemId && existingItem) {
      // The existing item is still in inventory, just no longer equipped
      // Set it as the new held item
      setHeldItemId(existingItemId);
      setHeldItemSourceTabId(null); // Not in stash - it was equipped
    } else {
      // Clear held state
      setHeldItemId(null);
      setHeldItemSourceTabId(null);
    }
  }, [heldItemId, selectedCharacter, inventory, equipItem]);
  
  // Handle picking up an equipped item (put on mouse)
  const handlePickupEquipped = useCallback((slot: GearSlot, itemId: string) => {
    if (!selectedCharacter) return;
    
    // Unequip the item
    unequipItem(selectedCharacter.id, slot);
    
    // Put it on the mouse
    setHeldItemId(itemId);
    setHeldItemSourceTabId(null); // Not from stash
  }, [selectedCharacter, unequipItem]);
  
  // Handle dropping held item back to stash (when clicking elsewhere)
  // @ts-ignore - intentionally unused
  const _handleDropHeldItemToStash = useCallback(() => {
    if (!heldItemId || !activeTab) return;
    
    const item = inventory.find(i => i.id === heldItemId);
    if (!item) {
      // Item not found, just clear state
      setHeldItemId(null);
      setHeldItemSourceTabId(null);
      return;
    }
    
    const itemSize = getItemGridSize(item);
    const grid = buildOccupancyGrid(activeTab.items, inventory);
    
    // Try to find a spot in the stash
    for (let y = 0; y <= 24 - itemSize.height; y++) {
      for (let x = 0; x <= 24 - itemSize.width; x++) {
        if (canPlaceItem(grid, itemSize, x, y)) {
          addItemToStash(activeTab.id, heldItemId, x, y);
          setHeldItemId(null);
          setHeldItemSourceTabId(null);
          return;
        }
      }
    }
    
    // Couldn't place, keep it on cursor
  }, [heldItemId, activeTab, inventory, addItemToStash]);

  if (!selectedCharacter) {
    return (
      <div className="panel">
        <div className="panel-content" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ color: 'var(--text-dim)' }}>Select a character from the Team tab</h3>
        </div>
      </div>
    );
  }

  // @ts-ignore - intentionally unused
  const _handleEquip = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (item && item.slot) {
      equipItem(selectedCharacter.id, item.slot, itemId);
      setSelectedItem(null);
    }
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '260px 1fr 720px', 
      gap: '1rem',
      height: 'calc(100vh - 90px)',
      overflow: 'hidden',
      padding: '0.5rem 1rem'
    }}>
      <CharacterSelector
        team={team}
        selectedCharacterId={selectedCharacterId}
        onSelectCharacter={selectCharacter}
        getCharacterInfo={(char) => {
          const gearCount = Object.values(char.equippedGear).filter(Boolean).length;
          return `${gearCount}/10 equipped`;
        }}
      />

      <GearSlots 
        character={selectedCharacter} 
        inventory={inventory}
        heldItemId={heldItemId}
        onEquipHeldItem={handleEquipHeldItem}
        onPickupEquipped={handlePickupEquipped}
      />

      <InventoryPanel
        inventory={inventory}
        selectedItem={selectedItem}
        onSelectItem={setSelectedItem}
        characterId={selectedCharacter.id}
        heldItemId={heldItemId}
        setHeldItemId={setHeldItemId}
        heldItemSourceTabId={heldItemSourceTabId}
        setHeldItemSourceTabId={setHeldItemSourceTabId}
        characterLevel={selectedCharacter.level}
        characterStats={totalStats || selectedCharacter.baseStats}
        currentMainHand={selectedCharacter.equippedGear.mainHand ? inventory.find(i => i.id === selectedCharacter.equippedGear.mainHand) : null}
        currentOffHand={selectedCharacter.equippedGear.offHand ? inventory.find(i => i.id === selectedCharacter.equippedGear.offHand) : null}
      />
    </div>
  );
}
