import React from 'react';
import type { Character } from '../../types/character';
import { GiShieldBash, GiHealthPotion, GiBroadsword, GiWizardStaff } from 'react-icons/gi';
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

interface CharacterGridProps {
  team: Character[];
  selectedCharacterId: string | null;
  onSelectCharacter: (id: string) => void;
  onAddCharacter: () => void;
}

export function CharacterGrid({ team, selectedCharacterId, onSelectCharacter, onAddCharacter }: CharacterGridProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Your Team ({team.length}/5)</h3>
        <button 
          className="btn btn-primary btn-small"
          onClick={onAddCharacter}
          disabled={team.length >= 5}
        >
          + Add Character
        </button>
      </div>
      <div className="panel-content">
        <div className="character-grid">
          {team.map(char => {
            const classData = char.classId ? getClassById(char.classId) : null;
            return (
              <div
                key={char.id}
                className={`character-card ${char.role} ${selectedCharacterId === char.id ? 'selected' : ''}`}
                onClick={() => onSelectCharacter(char.id)}
              >
                <div className="character-portrait">{ROLE_PORTRAITS[char.role]}</div>
                <div className="character-name">{classData?.name || char.role.toUpperCase()}</div>
                <div className={`character-role ${char.role}`}>
                  {ROLE_ICONS[char.role]} {char.role.toUpperCase()}
                </div>
                <div className="character-level">Level {char.level}</div>
              </div>
            );
          })}
          
          {/* Empty slots */}
          {Array(5 - team.length).fill(null).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="character-card"
              style={{ opacity: 0.3, cursor: 'default' }}
              onClick={onAddCharacter}
            >
              <div className="character-portrait">➕</div>
              <div className="character-name">Add Character</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

