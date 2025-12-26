import React, { useState } from 'react';
import { playLootSound, playMapDropSound, playFragmentDropSound } from '../../utils/lootSoundsHowler';
import { SoundBrowser } from './SoundBrowser';

export function SoundTestButton() {
  const [showBrowser, setShowBrowser] = useState(false);
  
  const testSounds = () => {
    console.log('Testing loot sounds...');
    
    // Test each rarity
    setTimeout(() => {
      console.log('Playing uncommon');
      playLootSound('uncommon');
    }, 0);
    
    setTimeout(() => {
      console.log('Playing rare');
      playLootSound('rare');
    }, 600);
    
    setTimeout(() => {
      console.log('Playing epic');
      playLootSound('epic');
    }, 1200);
    
    setTimeout(() => {
      console.log('Playing legendary');
      playLootSound('legendary');
    }, 1800);
    
    setTimeout(() => {
      console.log('Playing map');
      playMapDropSound();
    }, 2400);
    
    setTimeout(() => {
      console.log('Playing fragment');
      playFragmentDropSound();
    }, 3000);
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px',
        zIndex: 10000,
      }}>
        <button
          onClick={testSounds}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4a5568',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Test Sounds
        </button>
        
        <button
          onClick={() => setShowBrowser(!showBrowser)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#a855f7',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {showBrowser ? 'Close Browser' : 'Browse Sounds'}
        </button>
      </div>
      
      {showBrowser && <SoundBrowser />}
    </>
  );
}

