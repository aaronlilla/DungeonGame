import React from 'react';
import type { Character } from '../../types/character';
import { GiShieldBash, GiHealthPotion, GiBroadsword, GiWizardStaff } from 'react-icons/gi';
import { getExperienceProgress, getExperienceRequiredForLevel } from '../../utils/leveling';
import { getClassById } from '../../types/classes';

const ROLE_ICONS: Record<string, React.ReactNode> = {
  tank: <GiShieldBash />,
  healer: <GiHealthPotion />,
  dps: <GiBroadsword />
};

const ROLE_PORTRAITS: Record<string, React.ReactNode> = {
  tank: <GiShieldBash />,
  healer: <GiHealthPotion />,
  dps: <GiWizardStaff />
};

interface CharacterDetailsProps {
  character: Character | null;
  onEdit: () => void;
  onRemove: () => void;
}

const formatStatName = (key: string): string => {
  // PoE stat name formatting
  const statNames: Record<string, string> = {
    strength: 'Strength',
    dexterity: 'Dexterity',
    intelligence: 'Intelligence',
    life: 'Life',
    maxLife: 'Max Life',
    mana: 'Mana',
    maxMana: 'Max Mana',
    armor: 'Armor',
    evasion: 'Evasion Rating',
    energyShield: 'Energy Shield',
    criticalStrikeChance: 'Critical Strike Chance',
    criticalStrikeMultiplier: 'Critical Strike Multiplier',
    fireResistance: 'Fire Resistance',
    coldResistance: 'Cold Resistance',
    lightningResistance: 'Lightning Resistance',
    chaosResistance: 'Chaos Resistance',
    blockChance: 'Block Chance',
    spellBlockChance: 'Spell Block Chance',
    spellSuppressionChance: 'Spell Suppression Chance',
  };
  
  return statNames[key] || key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};

export function CharacterDetails({ character, onEdit, onRemove }: CharacterDetailsProps) {
  if (!character) {
    return (
      <div className="panel">
        <div className="panel-header">
          <h3>Select a Character</h3>
        </div>
        <div className="panel-content">
          <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>
            Select a character to view their details
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>{(() => {
          const classData = character.classId ? getClassById(character.classId) : null;
          return classData?.name || character.role.toUpperCase();
        })()}</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn btn-secondary btn-small"
            onClick={onEdit}
          >
            ✏️ Edit
          </button>
          <button 
            className="btn btn-danger btn-small"
            onClick={onRemove}
          >
            🗑️ Remove
          </button>
        </div>
      </div>
      <div className="panel-content">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
            {ROLE_PORTRAITS[character.role]}
          </div>
          <h4 style={{ color: 'var(--text-primary)' }}>{(() => {
            const classData = character.classId ? getClassById(character.classId) : null;
            return classData?.name || character.role.toUpperCase();
          })()}</h4>
          <div className={`character-role ${character.role}`} style={{ marginTop: '0.25rem' }}>
            {ROLE_ICONS[character.role]} {character.role.toUpperCase()}
          </div>
          <div style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: character.level >= 100 ? '#FFD700' : character.level >= 90 ? '#FFA500' : 'var(--accent-gold)' }}>
              Level {character.level}{character.level >= 100 ? ' (MAX)' : ''}
            </div>
            {character.level < 100 && (() => {
              const progress = getExperienceProgress(character);
              return (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span>Experience</span>
                    <span>{progress.current.toLocaleString()} / {progress.required.toLocaleString()}</span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    background: 'var(--bg-dark)', 
                    borderRadius: '4px', 
                    overflow: 'hidden',
                    border: '1px solid var(--bg-light)'
                  }}>
                    <div style={{ 
                      width: `${progress.percentage}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, var(--accent-gold) 0%, var(--accent-blue) 100%)',
                      transition: 'width 0.3s ease-out',
                      boxShadow: '0 0 8px rgba(255, 215, 0, 0.4)'
                    }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem', textAlign: 'center' }}>
                    {progress.percentage.toFixed(1)}% to Level {character.level + 1}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <h4 style={{ marginBottom: '0.75rem' }}>Attributes</h4>
        <div className="stats-grid">
          <div className="stat-row">
            <span className="stat-name">Strength</span>
            <span className="stat-value">{Math.floor(character.baseStats.strength)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-name">Dexterity</span>
            <span className="stat-value">{Math.floor(character.baseStats.dexterity)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-name">Intelligence</span>
            <span className="stat-value">{Math.floor(character.baseStats.intelligence)}</span>
          </div>
        </div>

        <h4 style={{ marginBottom: '0.75rem', marginTop: '1rem' }}>Life & Mana</h4>
        <div className="stats-grid">
          <div className="stat-row">
            <span className="stat-name">Life</span>
            <span className="stat-value">{Math.floor(character.baseStats.life)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-name">Mana</span>
            <span className="stat-value">{Math.floor(character.baseStats.mana)}</span>
          </div>
        </div>

        <h4 style={{ marginBottom: '0.75rem', marginTop: '1rem' }}>Defenses</h4>
        <div className="stats-grid">
          <div className="stat-row">
            <span className="stat-name">Armor</span>
            <span className="stat-value">{Math.floor(character.baseStats.armor)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-name">Evasion Rating</span>
            <span className="stat-value">{Math.floor(character.baseStats.evasion)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-name">Energy Shield</span>
            <span className="stat-value">{Math.floor(character.baseStats.energyShield)}</span>
          </div>
        </div>

        <h4 style={{ marginBottom: '0.75rem', marginTop: '1rem' }}>Critical Strike</h4>
        <div className="stats-grid">
          <div className="stat-row">
            <span className="stat-name">Critical Strike Chance</span>
            <span className="stat-value">{Math.floor(character.baseStats.criticalStrikeChance)}%</span>
          </div>
          <div className="stat-row">
            <span className="stat-name">Critical Strike Multiplier</span>
            <span className="stat-value">{Math.floor(character.baseStats.criticalStrikeMultiplier)}%</span>
          </div>
        </div>

        <h4 style={{ marginBottom: '0.75rem', marginTop: '1rem' }}>Resistances</h4>
        <div className="stats-grid">
          <div className="stat-row">
            <span className="stat-name">Fire Resistance</span>
            <span className="stat-value">{Math.floor(character.baseStats.fireResistance)}%</span>
          </div>
          <div className="stat-row">
            <span className="stat-name">Cold Resistance</span>
            <span className="stat-value">{Math.floor(character.baseStats.coldResistance)}%</span>
          </div>
          <div className="stat-row">
            <span className="stat-name">Lightning Resistance</span>
            <span className="stat-value">{Math.floor(character.baseStats.lightningResistance)}%</span>
          </div>
          <div className="stat-row">
            <span className="stat-name">Chaos Resistance</span>
            <span className="stat-value">{Math.floor(character.baseStats.chaosResistance)}%</span>
          </div>
        </div>

        <h4 style={{ marginBottom: '0.75rem', marginTop: '1rem' }}>Block & Spell Defense</h4>
        <div className="stats-grid">
          <div className="stat-row">
            <span className="stat-name">Block Chance</span>
            <span className="stat-value">{Math.floor(character.baseStats.blockChance)}%</span>
          </div>
          <div className="stat-row">
            <span className="stat-name">Spell Block Chance</span>
            <span className="stat-value">{Math.floor(character.baseStats.spellBlockChance)}%</span>
          </div>
          <div className="stat-row">
            <span className="stat-name">Spell Suppression Chance</span>
            <span className="stat-value">{Math.floor(character.baseStats.spellSuppressionChance)}%</span>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.75rem' }}>Build Summary</h4>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.5rem',
            background: 'var(--bg-dark)',
            padding: '1rem',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span>💎 Skills Equipped</span>
              <span style={{ color: 'var(--accent-blue)' }}>{character.skillGems.filter(s => s.skillGemId).length} / 5</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span>⚔️ Gear Equipped</span>
              <span style={{ color: 'var(--accent-gold)' }}>{Object.keys(character.equippedGear).length} / 14</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span>🌳 Passives Allocated</span>
              <span style={{ color: 'var(--accent-green)' }}>{character.allocatedPassives.length} pts</span>
            </div>
          </div>
          <p style={{ 
            marginTop: '1rem', 
            fontSize: '0.85rem', 
            color: 'var(--text-dim)',
            textAlign: 'center' 
          }}>
            Use the Skills, Gear, and Passives tabs to customize this character's build.
          </p>
        </div>
      </div>
    </div>
  );
}

