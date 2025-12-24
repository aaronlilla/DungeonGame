import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { 
  SkillUsageConfig, 
  TargetCountCondition, 
  TargetTypeCondition,
  ComparisonOperator,
  EffectApplicationCondition
} from '../../types/skillUsage';
import { createSmartSkillConfig, describeSkillConfig } from '../../types/skillUsage';
import type { SkillGem } from '../../types/skills';
import { Checkbox, Select, NumberInput, Toggle, ButtonGroup, Slider } from '../ui/FormControls';

interface SkillUsageConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: SkillUsageConfig) => void;
  skill: SkillGem;
  currentConfig?: SkillUsageConfig;
}

export function SkillUsageConfigModal({
  isOpen,
  onClose,
  onSave,
  skill,
  currentConfig
}: SkillUsageConfigModalProps) {
  const [config, setConfig] = useState<SkillUsageConfig>(
    currentConfig || createSmartSkillConfig(skill.id)
  );

  useEffect(() => {
    if (isOpen) {
      setConfig(currentConfig || createSmartSkillConfig(skill.id));
    }
  }, [isOpen, currentConfig, skill.id]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const handleReset = () => {
    setConfig(createSmartSkillConfig(skill.id));
  };

  const updateConfig = (updates: Partial<SkillUsageConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  // Use portal to render modal at document body level for proper z-index
  return createPortal(
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div 
        className="modal" 
        onClick={e => e.stopPropagation()}
        style={{ 
          maxWidth: '700px', 
          width: '90vw',
          zIndex: 10001
        }}
      >
        <div className="modal-header">
          <h3>⚙️ Configure: {skill.icon} {skill.name}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {/* Enable/Disable Toggle */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            background: config.enabled 
              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)' 
              : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
            borderRadius: '10px',
            border: `1px solid ${config.enabled ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            marginBottom: '1.5rem'
          }}>
            <Toggle
              checked={config.enabled}
              onChange={enabled => updateConfig({ enabled })}
              label={config.enabled ? 'Skill Enabled' : 'Skill Disabled'}
            />
          </div>

          {/* Priority Slider */}
          <ConfigSection title="Priority" icon="📊">
            <Slider
              value={config.priority}
              onChange={priority => updateConfig({ priority })}
              min={1}
              max={10}
              valueColor={v => v >= 8 ? '#ef4444' : v >= 5 ? '#f59e0b' : 'var(--text-dim)'}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem', fontStyle: 'italic' }}>
              Higher priority skills are checked first. Use 8-10 for emergency abilities.
            </p>
          </ConfigSection>

          {/* Target Count */}
          <ConfigSection title="Target Count" icon="👥">
            <ButtonGroup
              value={config.targetCount}
              onChange={targetCount => updateConfig({ targetCount: targetCount as TargetCountCondition })}
              options={[
                { value: 'any', label: 'Any' },
                { value: 'single', label: '1' },
                { value: 'two_plus', label: '2+' },
                { value: 'three_plus', label: '3+' },
                { value: 'five_plus', label: '5+' }
              ]}
            />
          </ConfigSection>

          {/* Target Type */}
          <ConfigSection title="Target Type" icon="🎯">
            <ButtonGroup
              value={config.targetType}
              onChange={targetType => updateConfig({ targetType: targetType as TargetTypeCondition })}
              options={[
                { value: 'any', label: 'Any' },
                { value: 'lowest_health', label: 'Low HP' },
                { value: 'highest_health', label: 'High HP' },
                { value: 'elite_plus', label: 'Elite+' },
                { value: 'boss', label: 'Boss' }
              ]}
            />
          </ConfigSection>

          {/* Health Conditions */}
          <ConfigSection title="Health Conditions" icon="❤️">
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.75rem',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 100%)',
              borderRadius: '10px',
              padding: '1rem'
            }}>
              <ConditionRow
                label="Self HP"
                enabled={config.selfHealth.enabled}
                onToggle={enabled => updateConfig({ selfHealth: { ...config.selfHealth, enabled } })}
              >
                <Select
                  value={config.selfHealth.operator}
                  onChange={op => updateConfig({ selfHealth: { ...config.selfHealth, operator: op as ComparisonOperator } })}
                  disabled={!config.selfHealth.enabled}
                  options={operatorOptions}
                  style={{ width: '70px' }}
                />
                <NumberInput
                  value={config.selfHealth.threshold}
                  onChange={threshold => updateConfig({ selfHealth: { ...config.selfHealth, threshold } })}
                  disabled={!config.selfHealth.enabled}
                  min={0}
                  max={100}
                  suffix="%"
                />
              </ConditionRow>
              
              <ConditionRow
                label="Tank HP"
                enabled={config.tankHealth.enabled}
                onToggle={enabled => updateConfig({ tankHealth: { ...config.tankHealth, enabled } })}
              >
                <Select
                  value={config.tankHealth.operator}
                  onChange={op => updateConfig({ tankHealth: { ...config.tankHealth, operator: op as ComparisonOperator } })}
                  disabled={!config.tankHealth.enabled}
                  options={operatorOptions}
                  style={{ width: '70px' }}
                />
                <NumberInput
                  value={config.tankHealth.threshold}
                  onChange={threshold => updateConfig({ tankHealth: { ...config.tankHealth, threshold } })}
                  disabled={!config.tankHealth.enabled}
                  min={0}
                  max={100}
                  suffix="%"
                />
              </ConditionRow>
              
              <ConditionRow
                label="Lowest Ally"
                enabled={config.allyHealth.enabled}
                onToggle={enabled => updateConfig({ allyHealth: { ...config.allyHealth, enabled } })}
              >
                <Select
                  value={config.allyHealth.operator}
                  onChange={op => updateConfig({ allyHealth: { ...config.allyHealth, operator: op as ComparisonOperator } })}
                  disabled={!config.allyHealth.enabled}
                  options={operatorOptions}
                  style={{ width: '70px' }}
                />
                <NumberInput
                  value={config.allyHealth.threshold}
                  onChange={threshold => updateConfig({ allyHealth: { ...config.allyHealth, threshold } })}
                  disabled={!config.allyHealth.enabled}
                  min={0}
                  max={100}
                  suffix="%"
                />
              </ConditionRow>
            </div>
          </ConfigSection>

          {/* Mana Condition */}
          <ConfigSection title="Mana Condition" icon="💧">
            <div style={{ 
              background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 100%)',
              borderRadius: '10px',
              padding: '1rem'
            }}>
              <ConditionRow
                label="Mana"
                enabled={config.mana.enabled}
                onToggle={enabled => updateConfig({ mana: { ...config.mana, enabled } })}
              >
                <Select
                  value={config.mana.operator}
                  onChange={op => updateConfig({ mana: { ...config.mana, operator: op as ComparisonOperator } })}
                  disabled={!config.mana.enabled}
                  options={[
                    { value: 'greater_than', label: '>' },
                    { value: 'greater_equal', label: '≥' },
                    { value: 'less_than', label: '<' },
                    { value: 'less_equal', label: '≤' }
                  ]}
                  style={{ width: '70px' }}
                />
                <NumberInput
                  value={config.mana.threshold}
                  onChange={threshold => updateConfig({ mana: { ...config.mana, threshold } })}
                  disabled={!config.mana.enabled}
                  min={0}
                  max={100}
                  suffix="%"
                />
              </ConditionRow>
            </div>
          </ConfigSection>

          {/* Party Hurt (for AoE heals) */}
          {(skill.targetType === 'allAllies' || skill.id.includes('heal')) && (
            <ConfigSection title="Party Condition" icon="👨‍👩‍👧‍👦">
              <div style={{ 
                background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 100%)',
                borderRadius: '10px',
                padding: '1rem'
              }}>
                <ConditionRow
                  label="Party Hurt"
                  enabled={config.partyHurt.enabled}
                  onToggle={enabled => updateConfig({ partyHurt: { ...config.partyHurt, enabled } })}
                >
                  <NumberInput
                    value={config.partyHurt.minCount}
                    onChange={minCount => updateConfig({ partyHurt: { ...config.partyHurt, minCount } })}
                    disabled={!config.partyHurt.enabled}
                    min={1}
                    max={5}
                  />
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>below</span>
                  <NumberInput
                    value={config.partyHurt.healthThreshold}
                    onChange={healthThreshold => updateConfig({ partyHurt: { ...config.partyHurt, healthThreshold } })}
                    disabled={!config.partyHurt.enabled}
                    min={0}
                    max={100}
                    suffix="%"
                  />
                </ConditionRow>
              </div>
            </ConfigSection>
          )}

          {/* Effect Application (for DOTs/HOTs) */}
          <ConfigSection 
            title={isDotSkill(skill) ? "DOT Application" : isHotSkill(skill) ? "HOT Application" : "Effect Application"} 
            icon={isDotSkill(skill) ? "🔥" : isHotSkill(skill) ? "💚" : "✨"}
          >
            <div style={{ 
              background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 100%)',
              borderRadius: '10px',
              padding: '1rem'
            }}>
              <ConditionRow
                label="Track Effect"
                enabled={config.effectApplication?.enabled ?? false}
                onToggle={enabled => updateConfig({ 
                  effectApplication: { 
                    ...config.effectApplication ?? { targetGroup: isDotSkill(skill) ? 'enemies' : 'allies', operator: 'less_than', count: 99, prioritizeWithout: true }, 
                    enabled 
                  } 
                })}
              >
                <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  Cast while
                </span>
              </ConditionRow>
              
              {config.effectApplication?.enabled && (
                <>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    marginTop: '0.75rem',
                    marginLeft: '130px',
                    flexWrap: 'wrap'
                  }}>
                    <Select
                      value={config.effectApplication.operator}
                      onChange={op => updateConfig({ 
                        effectApplication: { ...config.effectApplication!, operator: op as ComparisonOperator } 
                      })}
                      options={[
                        { value: 'less_than', label: '<' },
                        { value: 'less_equal', label: '≤' },
                        { value: 'equal', label: '=' },
                        { value: 'greater_equal', label: '≥' },
                        { value: 'greater_than', label: '>' }
                      ]}
                      style={{ width: '70px' }}
                    />
                    <NumberInput
                      value={config.effectApplication.count}
                      onChange={count => updateConfig({ 
                        effectApplication: { ...config.effectApplication!, count } 
                      })}
                      min={0}
                      max={99}
                    />
                    <Select
                      value={config.effectApplication.targetGroup}
                      onChange={targetGroup => updateConfig({ 
                        effectApplication: { ...config.effectApplication!, targetGroup: targetGroup as 'enemies' | 'allies' } 
                      })}
                      options={[
                        { value: 'enemies', label: 'enemies' },
                        { value: 'allies', label: 'allies' }
                      ]}
                      style={{ width: '100px' }}
                    />
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>have effect</span>
                  </div>
                  
                  <div style={{ 
                    marginTop: '0.75rem', 
                    marginLeft: '130px'
                  }}>
                    <Checkbox
                      checked={config.effectApplication.prioritizeWithout}
                      onChange={prioritizeWithout => updateConfig({ 
                        effectApplication: { ...config.effectApplication!, prioritizeWithout } 
                      })}
                      label="Prioritize targets without the effect"
                    />
                  </div>
                  
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--text-dim)', 
                    marginTop: '0.75rem',
                    marginLeft: '130px',
                    fontStyle: 'italic',
                    lineHeight: 1.4
                  }}>
                    {describeEffectCondition(config.effectApplication)}
                  </p>
                </>
              )}
            </div>
          </ConfigSection>

          {/* Cooldown Mode */}
          <ConfigSection title="Cooldown Behavior" icon="⏱️">
            <ButtonGroup
              value={config.cooldown.mode}
              onChange={mode => updateConfig({ cooldown: { ...config.cooldown, mode: mode as 'on_cooldown' | 'normal' | 'save_for_burst' } })}
              options={[
                { value: 'on_cooldown', label: '⚡ Use ASAP', icon: '' },
                { value: 'normal', label: '🔄 Normal', icon: '' },
                { value: 'save_for_burst', label: '💾 Save', icon: '' }
              ]}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.75rem', fontStyle: 'italic', textAlign: 'center' }}>
              {cooldownModeDescriptions[config.cooldown.mode]}
            </p>
          </ConfigSection>

          {/* Preview */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem 1.25rem', 
            background: 'linear-gradient(135deg, rgba(139, 90, 43, 0.1) 0%, rgba(139, 90, 43, 0.03) 100%)',
            borderRadius: '4px',
            border: '1px solid rgba(139, 90, 43, 0.3)'
          }}>
            <h4 style={{ 
              marginBottom: '0.5rem', 
              color: 'var(--accent-primary)',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>📝</span> Summary
            </h4>
            <p style={{ 
              fontSize: '0.9rem', 
              color: 'var(--text-normal)',
              lineHeight: 1.5
            }}>
              {describeSkillConfig(config)}
            </p>
          </div>
        </div>

        <div className="modal-footer" style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          background: 'rgba(0,0,0,0.2)',
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
          <button 
            className="btn btn-secondary" 
            onClick={handleReset}
            style={{
              opacity: 0.8,
              fontSize: '0.85rem'
            }}
          >
            🔄 Reset
          </button>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={onClose}
              style={{ minWidth: '90px' }}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSave}
              style={{ 
                minWidth: '90px',
                background: 'linear-gradient(135deg, #8b6914 0%, #5a4510 100%)',
                border: '1px solid #c9a227',
                boxShadow: '0 4px 12px rgba(201, 162, 39, 0.25)'
              }}
            >
              💾 Save
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Operator options for health/mana conditions
const operatorOptions = [
  { value: 'less_than', label: '<' },
  { value: 'less_equal', label: '≤' },
  { value: 'greater_than', label: '>' },
  { value: 'greater_equal', label: '≥' }
];

// Helper component for config sections
function ConfigSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <h4 style={{ 
        marginBottom: '0.6rem', 
        fontSize: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--text-dim)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        fontWeight: 600
      }}>
        <span>{icon}</span>
        {title}
      </h4>
      {children}
    </div>
  );
}

// Unified condition row component with consistent grid layout
function ConditionRow({ 
  label, 
  enabled,
  onToggle,
  children
}: { 
  label: string; 
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '130px 1fr', 
      alignItems: 'center', 
      gap: '1rem'
    }}>
      <Checkbox
        checked={enabled}
        onChange={onToggle}
        label={label}
      />
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        opacity: enabled ? 1 : 0.35,
        transition: 'opacity 0.2s ease',
        pointerEvents: enabled ? 'auto' : 'none'
      }}>
        {children}
      </div>
    </div>
  );
}

// Cooldown mode descriptions
const cooldownModeDescriptions = {
  on_cooldown: 'Use immediately when off cooldown and conditions are met',
  normal: 'Use when conditions are met, no special priority',
  save_for_burst: 'Save for boss fights or when Bloodlust is active'
};

// Helper functions to check skill type for DOT/HOT
function isDotSkill(skill: SkillGem): boolean {
  return skill.tags?.includes('dot') || 
         ['corruption', 'immolate'].includes(skill.id);
}

function isHotSkill(skill: SkillGem): boolean {
  return skill.tags?.includes('hot') || 
         ['rejuvenation'].includes(skill.id);
}

// Describe effect application condition in human-readable format
function describeEffectCondition(effectApp: { 
  targetGroup: 'enemies' | 'allies'; 
  operator: string; 
  count: number; 
  prioritizeWithout: boolean; 
}): string {
  const targetName = effectApp.targetGroup === 'enemies' ? 'enemies' : 'allies';
  const effectType = effectApp.targetGroup === 'enemies' ? 'DOT' : 'HOT';
  
  let description = '';
  
  if (effectApp.count >= 99) {
    description = `Keep casting until all ${targetName} have the ${effectType} applied.`;
  } else {
    const opText = {
      'less_than': `less than ${effectApp.count}`,
      'less_equal': `${effectApp.count} or fewer`,
      'equal': `exactly ${effectApp.count}`,
      'greater_equal': `${effectApp.count} or more`,
      'greater_than': `more than ${effectApp.count}`
    }[effectApp.operator] || `${effectApp.count}`;
    
    description = `Cast when ${opText} ${targetName} have the ${effectType}.`;
  }
  
  if (effectApp.prioritizeWithout) {
    description += ` Will target ${targetName} without the effect first.`;
  }
  
  return description;
}

