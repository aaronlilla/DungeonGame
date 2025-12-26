import { motion, AnimatePresence } from 'framer-motion';
import type { DungeonBoss, EnemyPack } from '../../types/dungeon';
import { getEnemyById } from '../../types/dungeon';
import { BOSS_KILL_BUFFS } from '../../types/bossAbilities';
import { getBossAbilities } from '../../systems/combat/bossAbilities';
import { calculateKeyScaling } from '../../types/dungeon';
import { calculateEnemyBaseStats } from '../../utils/monsterStats';
import { assignEnemyDefensiveStats } from '../../utils/enemyStats';
import { getEnemyImage } from '../../utils/enemyImages';
import type { BossAbility } from '../../types/bossAbilities';

interface BossSidebarProps {
  boss: DungeonBoss | EnemyPack | null;
  keyLevel: number;
  onClose: () => void;
}

export function BossSidebar({ boss, keyLevel, onClose }: BossSidebarProps) {
  if (!boss) return null;

  // Determine if this is a gate boss (EnemyPack) or final boss (DungeonBoss)
  const isGateBoss = 'enemies' in boss;
  
  let bossDisplayName: string;
  let bossImage: string | null;
  let bossEnemy;
  let isFinalBoss: boolean;
  
  if (isGateBoss) {
    // Gate boss - use the displayName from the pack (randomly assigned boss name)
    const pack = boss as EnemyPack;
    bossDisplayName = pack.displayName || '';
    bossEnemy = null;
    
    // Find the miniboss/elite enemy first (for stats calculation)
    for (const { enemyId } of pack.enemies) {
      const enemy = getEnemyById(enemyId);
      if (enemy && (enemy.type === 'miniboss' || enemy.type === 'elite')) {
        bossEnemy = enemy;
        // Only use enemy.name as fallback if displayName is not set
        if (!bossDisplayName) {
          bossDisplayName = enemy.name;
        }
        break;
      }
    }
    
    // Fallback to first enemy (for stats calculation)
    if (!bossEnemy && pack.enemies.length > 0) {
      bossEnemy = getEnemyById(pack.enemies[0].enemyId);
      // Only use enemy.name as fallback if displayName is not set
      if (!bossDisplayName && bossEnemy) {
        bossDisplayName = bossEnemy.name;
      }
    }
    
    if (!bossEnemy) return null;
    
    // Always use displayName for the image (the randomly assigned boss name)
    bossImage = getEnemyImage(bossDisplayName);
    isFinalBoss = false;
  } else {
    // Final boss
    const finalBoss = boss as DungeonBoss;
    bossDisplayName = finalBoss.displayName || finalBoss.enemy.name;
    bossEnemy = finalBoss.enemy;
    bossImage = getEnemyImage(bossDisplayName);
    isFinalBoss = true;
  }

  // Get abilities - try display name first, then fall back to underlying enemy name
  let bossAbilities = getBossAbilities(bossDisplayName);
  if (bossAbilities.length === 0 && bossEnemy) {
    // Fallback: try the underlying enemy's name (e.g., "Bone Golem", "Death Knight", "Undying Lich")
    // This handles cases where gate bosses have random final boss names assigned, or final bosses
    // don't have abilities defined for their display name
    bossAbilities = getBossAbilities(bossEnemy.name);
  }
  const killBuff = BOSS_KILL_BUFFS[bossDisplayName];
  
  // Calculate boss stats for current key level
  const scaling = calculateKeyScaling(keyLevel);
  
  // Ensure defensive stats are assigned
  assignEnemyDefensiveStats(bossEnemy);
  
  // Calculate base health and damage from PoE monster data
  const baseStats = calculateEnemyBaseStats(bossEnemy);
  
  // Apply map affix modifiers (default to 0 for preview)
  const healthMod = 1;
  const damageMod = 1;
  
  // Calculate final stats
  let finalHealth: number;
  let finalDamage: number;
  let finalArmor: number;
  let finalEvasion: number;
  let finalEnergyShield: number;
  
  if (isGateBoss) {
    // Gate boss stats (matching createPullEnemies calculations)
    // Minibosses: target ~16-20k HP at +2
    const healthMultiplier = (bossEnemy.type === 'miniboss') ? 30 : 50; // Miniboss: 30x, Boss: 50x
    const isBossType = bossEnemy.type === 'boss' || bossEnemy.type === 'miniboss';
    const damageMultiplier = isBossType ? 1.5 : 0.35; // Match travel.ts damage multipliers
    finalHealth = baseStats.baseHealth * scaling.healthMultiplier * healthMod * healthMultiplier;
    finalDamage = baseStats.baseDamage * scaling.damageMultiplier * damageMultiplier * damageMod * 1.3;
    finalArmor = (bossEnemy.baseArmor || 0) * scaling.healthMultiplier;
    finalEvasion = (bossEnemy.baseEvasion || 0) * scaling.healthMultiplier;
    finalEnergyShield = (bossEnemy.baseEnergyShield || 0) * scaling.healthMultiplier;
  } else {
    // Final boss stats (matching bossFight.ts calculations)
    // Final boss: target ~16-20k HP at +2
    finalHealth = baseStats.baseHealth * scaling.healthMultiplier * 20 * healthMod; // 20x multiplier for final boss
    finalDamage = baseStats.baseDamage * scaling.damageMultiplier * 1.0 * damageMod * 4; // Match bossFight.ts
    finalArmor = (bossEnemy.baseArmor || 0) * scaling.healthMultiplier;
    finalEvasion = (bossEnemy.baseEvasion || 0) * scaling.healthMultiplier;
    finalEnergyShield = (bossEnemy.baseEnergyShield || 0) * scaling.healthMultiplier;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '450px',
          maxWidth: '90vw',
          zIndex: 1000,
          background: 'linear-gradient(180deg, rgba(10, 8, 6, 0.98) 0%, rgba(20, 15, 10, 0.95) 100%)',
          borderLeft: '3px solid var(--accent-gold)',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8)',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {/* Background image with opacity */}
        {bossImage && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${bossImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.15,
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />
        )}
        
        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(0, 0, 0, 0.7)',
              border: '2px solid var(--accent-gold)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--accent-gold)',
              fontSize: '1.2rem',
              zIndex: 10,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 168, 75, 0.2)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ×
          </button>

          {/* Boss Image */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            {bossImage ? (
              <img
                src={bossImage}
                alt={bossDisplayName}
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'contain',
                  imageRendering: 'crisp-edges',
                  filter: 'drop-shadow(0 0 20px rgba(212, 168, 75, 0.5))',
                  marginBottom: '1rem'
                }}
              />
            ) : (
              <div style={{ fontSize: '8rem', marginBottom: '1rem' }}>
                {bossEnemy.icon}
              </div>
            )}
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: 'var(--accent-gold)',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
              marginBottom: '0.5rem',
              fontFamily: 'Cinzel, serif'
            }}>
              {bossDisplayName}
            </h2>
            <div style={{
              fontSize: '0.9rem',
              color: '#aaa',
              fontStyle: 'italic'
            }}>
              {isFinalBoss ? 'Final Boss' : 'Gate Boss'}
            </div>
          </div>

          {/* Stats Section */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.6)',
            border: '2px solid rgba(212, 168, 75, 0.3)',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: 'var(--accent-gold)',
              marginBottom: '1rem',
              borderBottom: '2px solid rgba(212, 168, 75, 0.3)',
              paddingBottom: '0.5rem'
            }}>
              Stats (Key +{keyLevel})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <StatRow label="Health" value={Math.floor(finalHealth).toLocaleString()} />
              <StatRow label="Damage" value={Math.floor(finalDamage).toLocaleString()} />
              <StatRow label="Armor" value={Math.floor(finalArmor).toLocaleString()} />
              <StatRow label="Evasion" value={Math.floor(finalEvasion).toLocaleString()} />
              {finalEnergyShield > 0 && (
                <StatRow label="Energy Shield" value={Math.floor(finalEnergyShield).toLocaleString()} />
              )}
              <StatRow label="Fire Res" value={`${bossEnemy.baseFireResistance || 0}%`} />
              <StatRow label="Cold Res" value={`${bossEnemy.baseColdResistance || 0}%`} />
              <StatRow label="Lightning Res" value={`${bossEnemy.baseLightningResistance || 0}%`} />
              <StatRow label="Chaos Res" value={`${bossEnemy.baseChaosResistance || 0}%`} />
            </div>
          </div>

          {/* Abilities Journal */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.6)',
            border: '2px solid rgba(212, 168, 75, 0.3)',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: 'var(--accent-gold)',
              marginBottom: '1rem',
              borderBottom: '2px solid rgba(212, 168, 75, 0.3)',
              paddingBottom: '0.5rem'
            }}>
              Ability Journal
            </h3>
            
            {bossAbilities.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {bossAbilities.map((ability) => (
                  <AbilityCard key={ability.id} ability={ability} />
                ))}
              </div>
            ) : (
              <div style={{ color: '#aaa', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
                No specific abilities defined for this boss.
              </div>
            )}
          </div>

          {/* Kill Buff */}
          {killBuff && (
            <div style={{
              background: 'rgba(155, 89, 182, 0.2)',
              border: '2px solid rgba(155, 89, 182, 0.5)',
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#9b59b6',
                marginBottom: '0.5rem',
                borderBottom: '2px solid rgba(155, 89, 182, 0.3)',
                paddingBottom: '0.5rem'
              }}>
                Kill Buff: {killBuff.name}
              </h3>
              <p style={{ color: '#d4a84b', marginBottom: '0.5rem' }}>
                {killBuff.description}
              </p>
              <div style={{ fontSize: '0.9rem', color: '#aaa' }}>
                {killBuff.effects.map((effect, idx) => (
                  <div key={idx} style={{ marginTop: '0.25rem' }}>
                    • {effect.type}: +{effect.value}%
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5rem',
      background: 'rgba(212, 168, 75, 0.05)',
      borderRadius: '4px'
    }}>
      <span style={{ color: '#aaa', fontSize: '0.9rem' }}>{label}:</span>
      <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '1rem' }}>
        {value}
      </span>
    </div>
  );
}

function AbilityCard({ ability }: { ability: BossAbility }) {
  const isSignature = ability.isSignature;
  
  return (
    <div style={{
      background: isSignature 
        ? 'rgba(155, 89, 182, 0.15)' 
        : 'rgba(212, 168, 75, 0.08)',
      border: `2px solid ${isSignature ? 'rgba(155, 89, 182, 0.4)' : 'rgba(212, 168, 75, 0.2)'}`,
      borderRadius: '6px',
      padding: '1rem',
      position: 'relative'
    }}>
      {isSignature && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          left: '12px',
          background: 'rgba(155, 89, 182, 0.9)',
          color: '#fff',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Signature
        </div>
      )}
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.5rem'
      }}>
        <h4 style={{
          fontSize: '1.1rem',
          fontWeight: 'bold',
          color: isSignature ? '#9b59b6' : 'var(--accent-gold)',
          margin: 0
        }}>
          {ability.name}
        </h4>
        {ability.isOncePerFight && (
          <span style={{
            fontSize: '0.7rem',
            color: '#ff4444',
            fontStyle: 'italic',
            background: 'rgba(255, 68, 68, 0.2)',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            Once per fight
          </span>
        )}
      </div>
      
      <p style={{
        color: '#ccc',
        fontSize: '0.9rem',
        marginBottom: '0.75rem',
        lineHeight: '1.4'
      }}>
        {ability.description}
      </p>
      
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        fontSize: '0.85rem',
        color: '#aaa'
      }}>
        {ability.castTime > 0 && (
          <span>⏱️ Cast: {ability.castTime}s</span>
        )}
        {ability.castTime === 0 && (
          <span>⚡ Instant</span>
        )}
        <span>🔄 CD: {ability.cooldown}s</span>
        {ability.damage && (
          <span>💥 Damage: ~{ability.damage}</span>
        )}
        {ability.damageType && (
          <span style={{
            textTransform: 'capitalize',
            color: getDamageTypeColor(ability.damageType)
          }}>
            {ability.damageType}
          </span>
        )}
      </div>
      
      {ability.effects && ability.effects.length > 0 && (
        <div style={{
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(212, 168, 75, 0.2)'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '0.25rem' }}>
            Effects:
          </div>
          {ability.effects.map((effect, idx) => (
            <div key={idx} style={{
              fontSize: '0.8rem',
              color: '#bbb',
              marginLeft: '0.5rem',
              marginTop: '0.25rem'
            }}>
              • {effect.name}
              {effect.stacks && ` (stacks${effect.maxStacks ? `, max ${effect.maxStacks}` : ''})`}
              {effect.duration && ` - ${effect.duration}s`}
              {effect.value !== undefined && ` - ${effect.value > 0 ? '+' : ''}${effect.value}${effect.type === 'debuff' || effect.type === 'buff' ? '%' : ''}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getDamageTypeColor(damageType: string): string {
  switch (damageType) {
    case 'fire': return '#ff6b6b';
    case 'cold': return '#4ecdc4';
    case 'lightning': return '#ffe66d';
    case 'chaos': return '#a29bfe';
    case 'physical': return '#95a5a6';
    default: return '#d4a84b';
  }
}

