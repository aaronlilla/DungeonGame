/**
 * Loot Filter Sounds - Path of Exile style item drop sounds
 * Uses Web Audio API to generate synthetic sounds
 */

// Audio context (lazy initialized)
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

// Sound configurations for each rarity tier
interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  gain: number;
  harmonics?: number[];
  sweep?: { from: number; to: number };
}

const SOUND_CONFIGS: Record<string, SoundConfig> = {
  common: {
    frequency: 400,
    duration: 0.1,
    type: 'sine',
    gain: 0.1
  },
  uncommon: {
    frequency: 600,
    duration: 0.15,
    type: 'triangle',
    gain: 0.15,
    harmonics: [1.5]
  },
  rare: {
    frequency: 800,
    duration: 0.2,
    type: 'square',
    gain: 0.2,
    harmonics: [1.25, 1.5],
    sweep: { from: 800, to: 1000 }
  },
  epic: {
    frequency: 1000,
    duration: 0.3,
    type: 'sawtooth',
    gain: 0.25,
    harmonics: [1.25, 1.5, 2],
    sweep: { from: 800, to: 1200 }
  },
  legendary: {
    frequency: 1200,
    duration: 0.5,
    type: 'sawtooth',
    gain: 0.35,
    harmonics: [1.25, 1.5, 2, 2.5],
    sweep: { from: 600, to: 1400 }
  }
};

/**
 * Play a loot drop sound based on rarity
 */
export function playLootSound(rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'): void {
  // Skip common sounds to avoid spam
  if (rarity === 'common') return;
  
  try {
    const ctx = getAudioContext();
    const config = SOUND_CONFIGS[rarity];
    const now = ctx.currentTime;
    
    // Master gain node
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(config.gain, now);
    masterGain.gain.exponentialRampToValueAtTime(0.01, now + config.duration);
    
    // Main oscillator
    const osc = ctx.createOscillator();
    osc.type = config.type;
    
    if (config.sweep) {
      osc.frequency.setValueAtTime(config.sweep.from, now);
      osc.frequency.exponentialRampToValueAtTime(config.sweep.to, now + config.duration * 0.5);
      osc.frequency.exponentialRampToValueAtTime(config.sweep.from, now + config.duration);
    } else {
      osc.frequency.setValueAtTime(config.frequency, now);
    }
    
    osc.connect(masterGain);
    osc.start(now);
    osc.stop(now + config.duration);
    
    // Add harmonics for richer sound
    if (config.harmonics) {
      config.harmonics.forEach((ratio, i) => {
        const harmOsc = ctx.createOscillator();
        harmOsc.type = 'sine';
        harmOsc.frequency.setValueAtTime(config.frequency * ratio, now);
        
        const harmGain = ctx.createGain();
        harmGain.gain.setValueAtTime(config.gain * (0.3 / (i + 1)), now);
        harmGain.gain.exponentialRampToValueAtTime(0.01, now + config.duration);
        
        harmOsc.connect(harmGain);
        harmGain.connect(ctx.destination);
        harmOsc.start(now);
        harmOsc.stop(now + config.duration);
      });
    }
    
    // For epic and legendary, add a "sparkle" effect
    if (rarity === 'epic' || rarity === 'legendary') {
      const numSparkles = rarity === 'legendary' ? 5 : 3;
      for (let i = 0; i < numSparkles; i++) {
        const sparkleOsc = ctx.createOscillator();
        sparkleOsc.type = 'sine';
        const sparkleFreq = 2000 + Math.random() * 2000;
        sparkleOsc.frequency.setValueAtTime(sparkleFreq, now + i * 0.05);
        
        const sparkleGain = ctx.createGain();
        sparkleGain.gain.setValueAtTime(0, now);
        sparkleGain.gain.linearRampToValueAtTime(0.1, now + i * 0.05);
        sparkleGain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.1);
        
        sparkleOsc.connect(sparkleGain);
        sparkleGain.connect(ctx.destination);
        sparkleOsc.start(now + i * 0.05);
        sparkleOsc.stop(now + i * 0.05 + 0.15);
      }
    }
  } catch (e) {
    // Audio not supported or blocked, fail silently
    console.warn('Could not play loot sound:', e);
  }
}

/**
 * Play a map drop sound (special sound for maps)
 */
export function playMapDropSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Low "thunk" for map drop
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(150, now);
    osc1.frequency.exponentialRampToValueAtTime(50, now + 0.3);
    
    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);
    
    // Higher "ding" for attention
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1200, now + 0.1);
    
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.2, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.4);
  } catch (e) {
    console.warn('Could not play map drop sound:', e);
  }
}

/**
 * Play a fragment drop sound
 */
export function playFragmentDropSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Crystal/gem-like sound
    const frequencies = [1500, 2000, 2500];
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.2);
    });
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

