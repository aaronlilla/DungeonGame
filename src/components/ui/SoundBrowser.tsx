import React, { useState } from 'react';
import { Howl } from 'howler';

export function SoundBrowser() {
  const [urls, setUrls] = useState({
    uncommon: '',
    rare: '',
    epic: '',
    legendary: '',
    map: '',
    fragment: '',
  });

  const [volume, setVolume] = useState(0.5);

  const playSound = (url: string) => {
    if (!url) {
      alert('Please enter a URL first');
      return;
    }
    
    try {
      const sound = new Howl({
        src: [url],
        volume: volume,
        html5: false,
      });
      sound.play();
    } catch (e) {
      console.error('Failed to play:', e);
      alert('Failed to play sound. Check console for errors.');
    }
  };

  const copyCode = () => {
    const code = `const SOUND_URLS = {
  uncommon: '${urls.uncommon}',
  rare: '${urls.rare}',
  epic: '${urls.epic}',
  legendary: '${urls.legendary}',
  map: '${urls.map}',
  fragment: '${urls.fragment}',
};`;
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard! Paste it into lootSoundsHowler.ts');
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(20, 18, 15, 0.98)',
      border: '2px solid #a855f7',
      borderRadius: '16px',
      padding: '2rem',
      width: '90%',
      maxWidth: '800px',
      maxHeight: '90vh',
      overflow: 'auto',
      zIndex: 10001,
      color: 'white',
    }}>
      <h2 style={{ marginBottom: '1rem', color: '#e9d5ff', fontFamily: "'Cinzel', Georgia, serif" }}>
        Sound Browser
      </h2>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#c4b5fd' }}>How to find sounds:</h3>
        <ol style={{ fontSize: '0.875rem', color: 'rgba(200, 190, 170, 0.9)', lineHeight: 1.6 }}>
          <li>Go to <a href="https://freesound.org/search/?q=coin+pickup" target="_blank" rel="noopener noreferrer" style={{ color: '#a855f7' }}>Freesound.org</a></li>
          <li>Search for: "coin", "pickup", "chime", "bell", "click", etc.</li>
          <li>Click on a sound to preview it</li>
          <li>Right-click the preview player and "Copy audio address"</li>
          <li>Paste the URL below and test it</li>
        </ol>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
          Volume: {Math.round(volume * 100)}%
        </label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {Object.entries(urls).map(([key, url]) => (
        <div key={key} style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.25rem', 
            fontSize: '0.875rem',
            color: '#e9d5ff',
            textTransform: 'capitalize',
            fontWeight: 600,
          }}>
            {key}
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrls({ ...urls, [key]: e.target.value })}
              placeholder="Paste Freesound preview URL here"
              style={{
                flex: 1,
                padding: '0.5rem',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '4px',
                color: 'white',
                fontSize: '0.75rem',
              }}
            />
            <button
              onClick={() => playSound(url)}
              disabled={!url}
              style={{
                padding: '0.5rem 1rem',
                background: url ? '#a855f7' : '#555',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: url ? 'pointer' : 'not-allowed',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              Test
            </button>
          </div>
        </div>
      ))}

      <div style={{ 
        marginTop: '2rem', 
        display: 'flex', 
        gap: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(168, 85, 247, 0.3)',
      }}>
        <button
          onClick={copyCode}
          style={{
            flex: 1,
            padding: '0.75rem',
            background: '#10b981',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          Copy Code
        </button>
      </div>

      <div style={{ 
        marginTop: '1rem', 
        padding: '1rem',
        background: 'rgba(168, 85, 247, 0.1)',
        borderRadius: '8px',
        fontSize: '0.75rem',
        color: 'rgba(200, 190, 170, 0.8)',
      }}>
        <strong>Tip:</strong> Look for sounds that are:
        <ul style={{ marginTop: '0.5rem', marginBottom: 0 }}>
          <li>Short (under 0.5 seconds)</li>
          <li>Not too loud or harsh</li>
          <li>Clear and distinct from each other</li>
          <li>Preview URLs usually end in "-lq.mp3" or "-hq.mp3"</li>
        </ul>
      </div>
    </div>
  );
}

