/**
 * Loot Filter Sounds - Using Howler.js with free sound effects
 * Sounds sourced from freesound.org (Creative Commons)
 */

import { Howl } from 'howler';
import { useGameStore } from '../store/gameStore';

// Import sound files directly for proper bundling
import uncommonSound from '../assets/sounds/uncommon.wav';
import rareSound from '../assets/sounds/rare.mp3';
import magicSound from '../assets/sounds/magic.wav';
import legendarySound from '../assets/sounds/legendary.wav';
import fragmentSound from '../assets/sounds/fragment.wav';

// Sound library - using imported sound files
const SOUND_URLS = {
  uncommon: uncommonSound,
  rare: rareSound,
  epic: magicSound, // Using magic for epic
  legendary: legendarySound,
  map: rareSound, // Reuse rare for maps
  fragment: fragmentSound,
};

// Howl instances (lazy loaded)
const sounds: Partial<Record<keyof typeof SOUND_URLS, Howl>> = {};
const loadingStates: Partial<Record<keyof typeof SOUND_URLS, 'loading' | 'loaded' | 'error'>> = {};

// Get current volume from game store
function getVolume(): number {
  return useGameStore.getState().volume;
}

// Get a sound (should be preloaded, but will lazy load if needed)
function getSound(key: keyof typeof SOUND_URLS): Howl {
  // If sound doesn't exist, create it (fallback for lazy loading)
  if (!sounds[key]) {
    console.warn('[LootSound] Sound not preloaded, lazy loading:', key);
    loadingStates[key] = 'loading';
    sounds[key] = new Howl({
      src: [SOUND_URLS[key]],
      volume: getVolume(),
      preload: true,
      html5: false, // Use Web Audio API for lower latency
      onload: () => {
        loadingStates[key] = 'loaded';
        console.log('[LootSound] Successfully lazy-loaded:', key);
      },
      onloaderror: (_id, error) => {
        loadingStates[key] = 'error';
        console.error('[LootSound] Failed to lazy-load:', key, error);
      },
      onplayerror: (_id, error) => {
        console.error('[LootSound] Failed to play:', key, error);
      },
    });
  }
  
  // Update volume in case it changed
  sounds[key]!.volume(getVolume());
  
  return sounds[key]!;
}

/**
 * Play a loot drop sound based on rarity
 */
export function playLootSound(rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'): void {
  // Skip common sounds to avoid spam
  if (rarity === 'common') return;
  
  // Get volume from store
  const volume = getVolume();
  if (volume === 0) return; // Muted
  
  try {
    const sound = getSound(rarity);
    sound.play();
  } catch (e) {
    console.warn('Could not play loot sound:', e);
  }
}

/**
 * Play a map drop sound (special sound for maps)
 */
export function playMapDropSound(): void {
  const volume = getVolume();
  if (volume === 0) return; // Muted
  
  try {
    const sound = getSound('map');
    sound.play();
  } catch (e) {
    console.warn('Could not play map drop sound:', e);
  }
}

/**
 * Play a fragment drop sound
 */
export function playFragmentDropSound(): void {
  const volume = getVolume();
  if (volume === 0) return; // Muted
  
  try {
    const sound = getSound('fragment');
    sound.play();
  } catch (e) {
    console.warn('Could not play fragment drop sound:', e);
  }
}

/**
 * Play the appropriate sound for a loot drop
 */
export function playDropSound(
  type: 'item' | 'orb' | 'map' | 'fragment',
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
): void {
  switch (type) {
    case 'map':
      playMapDropSound();
      break;
    case 'fragment':
      playFragmentDropSound();
      break;
    case 'item':
    case 'orb':
    default:
      playLootSound(rarity);
      break;
  }
}

/**
 * Preload all sounds (call this on game start)
 * Returns a promise that resolves when all sounds are loaded
 */
export function preloadLootSounds(): Promise<void> {
  console.log('[LootSound] Starting preload of all sounds...');
  
  // Create promises for each sound to load
  const loadPromises = Object.keys(SOUND_URLS).map(key => {
    const soundKey = key as keyof typeof SOUND_URLS;
    
    return new Promise<void>((resolve, reject) => {
      // If already loaded, resolve immediately
      if (loadingStates[soundKey] === 'loaded') {
        resolve();
        return;
      }
      
      // If already errored, reject immediately
      if (loadingStates[soundKey] === 'error') {
        reject(new Error(`Sound ${key} previously failed to load`));
        return;
      }
      
      // Create the sound with callbacks
      if (!sounds[soundKey]) {
        loadingStates[soundKey] = 'loading';
        sounds[soundKey] = new Howl({
          src: [SOUND_URLS[soundKey]],
          volume: getVolume(),
          preload: true,
          html5: false, // Use Web Audio API for lower latency
          onload: () => {
            loadingStates[soundKey] = 'loaded';
            console.log('[LootSound] Successfully loaded:', key);
            resolve();
          },
          onloaderror: (_id, error) => {
            loadingStates[soundKey] = 'error';
            console.error('[LootSound] Failed to load:', key, error);
            // Don't reject - we want the game to continue even if sounds fail
            resolve();
          },
          onplayerror: (_id, error) => {
            console.error('[LootSound] Failed to play:', key, error);
          },
        });
      } else {
        // Sound already exists, just resolve
        resolve();
      }
    });
  });
  
  // Wait for all sounds to load (or fail gracefully)
  return Promise.all(loadPromises).then(() => {
    console.log('[LootSound] All sounds preloaded');
  });
}

/**
 * Clean up all sounds (call on unmount)
 */
export function unloadLootSounds(): void {
  Object.values(sounds).forEach(sound => {
    if (sound) {
      sound.unload();
    }
  });
}

/**
 * Get loading status of all sounds (for debugging)
 */
export function getSoundLoadingStatus(): Record<string, string> {
  const status: Record<string, string> = {};
  Object.keys(SOUND_URLS).forEach(key => {
    const soundKey = key as keyof typeof SOUND_URLS;
    status[key] = loadingStates[soundKey] || 'not-loaded';
  });
  return status;
}


