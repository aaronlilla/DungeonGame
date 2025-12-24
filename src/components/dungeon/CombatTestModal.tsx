import { useEffect, useRef } from 'react';
import type { TestResult, FormulaTestResult } from '../../systems/combatSimulation/types';
import type { CombatLogEntry } from '../../types/dungeon';

interface CombatTestModalProps {
  result: TestResult | null;
  combatLog: CombatLogEntry[];
  isRunning: boolean;
  onClose: () => void;
  onStop?: () => void;
}

function FormulaTestSection({ title, icon, tests }: { title: string; icon: string; tests?: FormulaTestResult[] }) {
  if (!tests || tests.length === 0) return null;
  
  const allPassed = tests.every(t => t.passed);
  
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        marginBottom: '0.5rem',
        padding: '0.5rem',
        background: allPassed ? 'rgba(39, 174, 96, 0.2)' : 'rgba(231, 76, 60, 0.2)',
        borderRadius: '6px',
        borderLeft: `4px solid ${allPassed ? '#27ae60' : '#e74c3c'}`
      }}>
        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
        <span style={{ fontWeight: 'bold', color: '#fff' }}>{title}</span>
        <span style={{ 
          marginLeft: 'auto', 
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          background: allPassed ? '#27ae60' : '#e74c3c',
          color: '#fff',
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}>
          {allPassed ? '✓ PASS' : '✗ FAIL'}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '1rem' }}>
        {tests.map((test, i) => (
          <div key={i} style={{ 
            display: 'grid',
            gridTemplateColumns: '20px 1fr',
            gap: '0.5rem',
            padding: '0.4rem 0.5rem',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            fontSize: '0.85rem'
          }}>
            <span style={{ color: test.passed ? '#27ae60' : '#e74c3c' }}>
              {test.passed ? '✓' : '✗'}
            </span>
            <div>
              <div style={{ color: '#ddd', marginBottom: '0.15rem' }}>{test.name}</div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: '#888'
              }}>
                <div>Expected: <span style={{ color: '#aaa' }}>{test.expected}</span></div>
                <div>Actual: <span style={{ color: test.passed ? '#27ae60' : '#e74c3c' }}>{test.actual}</span></div>
              </div>
              {test.details && (
                <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.15rem', fontStyle: 'italic' }}>
                  {test.details}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CombatTestModal({ result, combatLog, isRunning, onClose, onStop }: CombatTestModalProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [combatLog]);

  if (!result && !isRunning) return null;

  const passRate = result && result.totalTests > 0 ? (result.passedTests / result.totalTests) * 100 : 0;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'linear-gradient(180deg, #1a1a22 0%, #12121a 100%)',
          border: `2px solid ${isRunning ? '#3498db' : (result?.passed ? '#27ae60' : '#e74c3c')}`,
          borderRadius: '12px',
          padding: '1.5rem',
          width: '95vw',
          maxWidth: '1400px',
          maxHeight: '95vh',
          overflow: 'hidden',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '1rem',
          flexShrink: 0
        }}>
          <div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '0.25rem',
              color: isRunning ? '#3498db' : (result?.passed ? '#27ae60' : '#e74c3c'),
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {isRunning ? '⚡' : (result?.passed ? '✅' : '❌')} 
              {isRunning ? 'Running Simulation...' : 'Combat Simulation Results'}
            </h2>
            {result && (
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#aaa' }}>
                <span>Tests: <strong style={{ color: '#fff' }}>{result.totalTests}</strong></span>
                <span>Passed: <strong style={{ color: '#27ae60' }}>{result.passedTests}</strong></span>
                <span>Failed: <strong style={{ color: '#e74c3c' }}>{result.failedTests}</strong></span>
                <span>Rate: <strong style={{ color: result.passed ? '#27ae60' : '#e74c3c' }}>{passRate.toFixed(0)}%</strong></span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {isRunning && (
              <button
                onClick={() => {
                  if ((window as any).__simulationStopRef) {
                    (window as any).__simulationStopRef.current = true;
                  }
                  if (onStop) onStop();
                }}
                style={{
                  background: '#e67e22',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  padding: '0.4rem 0.8rem',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 'bold'
                }}
              >
                ⏹ Stop
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: '#e74c3c',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                padding: '0.4rem 0.8rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 'bold'
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Formula Summary Banner */}
        {result?.formulaSummary && (
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            flexWrap: 'wrap',
            marginBottom: '1rem',
            padding: '0.75rem',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            flexShrink: 0
          }}>
            {[
              { key: 'armorWorking', label: 'Armor', icon: '🛡️' },
              { key: 'evasionWorking', label: 'Evasion', icon: '💨' },
              { key: 'blockWorking', label: 'Block', icon: '🔰' },
              { key: 'spellBlockWorking', label: 'Spell Block', icon: '✨' },
              { key: 'spellSuppressionWorking', label: 'Suppression', icon: '🔮' },
              { key: 'resistancesWorking', label: 'Resistances', icon: '🔥' },
              { key: 'energyShieldWorking', label: 'ES', icon: '⚡' },
              { key: 'criticalStrikesWorking', label: 'Crits', icon: '💥' },
              { key: 'healingWorking', label: 'Healing', icon: '💊' }
            ].map(({ key, label, icon }) => {
              const working = result.formulaSummary[key as keyof typeof result.formulaSummary];
              return (
                <div key={key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.3rem 0.6rem',
                  background: working ? 'rgba(39, 174, 96, 0.3)' : 'rgba(231, 76, 60, 0.3)',
                  border: `1px solid ${working ? '#27ae60' : '#e74c3c'}`,
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <span>{icon}</span>
                  <span style={{ color: working ? '#27ae60' : '#e74c3c' }}>{label}</span>
                  <span style={{ color: working ? '#27ae60' : '#e74c3c' }}>{working ? '✓' : '✗'}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Main Content - Two Column Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden'
        }}>
          {/* Left Column - Formula Tests */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <h3 style={{ color: '#3498db', marginBottom: '0.5rem', fontSize: '1rem', flexShrink: 0 }}>
              📊 Formula Test Results
            </h3>
            <div style={{ 
              flex: 1,
              overflowY: 'auto',
              paddingRight: '0.5rem'
            }}>
              {result && (
                <>
                  <FormulaTestSection
                    title="Armor (Physical Damage Reduction)"
                    icon="🛡️"
                    tests={result.details.armorTests}
                  />
                  <FormulaTestSection
                    title="Evasion (Chance to Dodge)"
                    icon="💨"
                    tests={result.details.evasionTests}
                  />
                  <FormulaTestSection
                    title="Block (Physical Block)"
                    icon="🔰"
                    tests={result.details.blockTests}
                  />
                  <FormulaTestSection
                    title="Spell Block"
                    icon="✨"
                    tests={result.details.spellBlockTests}
                  />
                  <FormulaTestSection
                    title="Spell Suppression"
                    icon="🔮"
                    tests={result.details.spellSuppressionTests}
                  />
                  <FormulaTestSection
                    title="Elemental Resistances"
                    icon="🔥"
                    tests={result.details.resistanceTests}
                  />
                  <FormulaTestSection
                    title="Energy Shield"
                    icon="⚡"
                    tests={result.details.energyShieldTests}
                  />
                  <FormulaTestSection
                    title="Critical Strikes"
                    icon="💥"
                    tests={result.details.criticalStrikeTests}
                  />
                  <FormulaTestSection
                    title="Healing"
                    icon="💊"
                    tests={result.details.healingTests}
                  />
                </>
              )}
              {!result && isRunning && (
                <div style={{ color: '#888', fontStyle: 'italic', padding: '2rem', textAlign: 'center' }}>
                  Running formula tests...
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Combat Log & Summary */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            gap: '0.75rem'
          }}>
            {/* Combat Summary */}
            {result && (
              <div style={{ 
                background: 'rgba(52, 152, 219, 0.1)',
                border: '1px solid #3498db',
                borderRadius: '8px',
                padding: '0.75rem',
                flexShrink: 0
              }}>
                <h3 style={{ color: '#3498db', marginBottom: '0.5rem', fontSize: '1rem' }}>📈 Combat Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <div>Damage Dealt: <strong style={{ color: '#e74c3c' }}>{result.summary.totalDamageDealt.toLocaleString()}</strong></div>
                  <div>Damage Taken: <strong style={{ color: '#e67e22' }}>{result.summary.totalDamageTaken.toLocaleString()}</strong></div>
                  <div>Healing Done: <strong style={{ color: '#27ae60' }}>{result.summary.totalHealing.toLocaleString()}</strong></div>
                  <div>Enemies Killed: <strong style={{ color: '#fff' }}>{result.summary.totalEnemiesKilled}</strong></div>
                  <div>Time Elapsed: <strong style={{ color: '#fff' }}>{result.summary.totalTime.toFixed(1)}s</strong></div>
                  <div>Deaths: <strong style={{ color: result.summary.deaths > 0 ? '#e74c3c' : '#27ae60' }}>{result.summary.deaths}</strong></div>
                  <div>Average DPS: <strong style={{ color: '#e74c3c' }}>{result.summary.averageDPS.toLocaleString()}</strong></div>
                  <div>Average HPS: <strong style={{ color: '#27ae60' }}>{result.summary.averageHPS.toLocaleString()}</strong></div>
                </div>
              </div>
            )}

            {/* Dungeon Completion */}
            {result?.details.dungeonCompletion && (
              <div style={{ 
                background: result.details.dungeonCompletion.passed ? 'rgba(39, 174, 96, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                border: `1px solid ${result.details.dungeonCompletion.passed ? '#27ae60' : '#e74c3c'}`,
                borderRadius: '8px',
                padding: '0.75rem',
                flexShrink: 0
              }}>
                <h3 style={{ 
                  color: result.details.dungeonCompletion.passed ? '#27ae60' : '#e74c3c', 
                  marginBottom: '0.5rem', 
                  fontSize: '1rem' 
                }}>
                  {result.details.dungeonCompletion.passed ? '🏆' : '💀'} Dungeon Completion
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <div>Packs: {result.details.dungeonCompletion.packsCleared}/{result.details.dungeonCompletion.totalPacks}</div>
                  <div>Forces: {result.details.dungeonCompletion.forcesCleared}/{result.details.dungeonCompletion.totalForces}</div>
                  <div>Gate Bosses: {result.details.dungeonCompletion.gateBossesKilled}</div>
                  <div>Final Boss: {result.details.dungeonCompletion.finalBossKilled ? '✅' : '❌'}</div>
                </div>
                <div style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  {result.details.dungeonCompletion.details}
                </div>
              </div>
            )}

            {/* Combat Log */}
            <div style={{ 
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid #444',
              borderRadius: '8px',
              padding: '0.75rem',
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexShrink: 0 }}>
                <h3 style={{ color: '#3498db', fontSize: '1rem', margin: 0 }}>📜 Combat Log</h3>
                <span style={{ color: '#888', fontSize: '0.8rem' }}>{combatLog.length} entries</span>
              </div>
              <div style={{ 
                flex: 1,
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.75rem'
              }}>
                {combatLog.length === 0 && (
                  <div style={{ color: '#666', fontStyle: 'italic' }}>
                    {isRunning ? 'Waiting for combat...' : 'No combat log entries.'}
                  </div>
                )}
                {combatLog.map((entry, i) => {
                  const colorMap: Record<string, string> = {
                    damage: '#ff6b6b',
                    heal: '#51cf66',
                    buff: '#4dabf7',
                    death: '#e03131',
                    phase: '#ffd43b',
                    pull: '#69db7c',
                    boss: '#ff6b9d',
                    ability: '#74c0fc',
                    travel: '#adb5bd',
                    loot: '#ffd43b'
                  };
                  const color = colorMap[entry.type] || '#fff';
                  return (
                    <div key={i} style={{ 
                      color,
                      padding: '0.15rem 0',
                      borderLeft: `2px solid ${color}`,
                      paddingLeft: '0.4rem',
                      lineHeight: '1.3'
                    }}>
                      <span style={{ color: '#666' }}>[{entry.timestamp.toFixed(1)}s]</span>{' '}
                      {entry.message}
                    </div>
                  );
                })}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
