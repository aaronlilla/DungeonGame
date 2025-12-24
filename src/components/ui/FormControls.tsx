import React from 'react';

// Vintage gold color for accents
const ACCENT_GOLD = '#c9a227';
const ACCENT_GOLD_DIM = '#8b6914';

// ===== CUSTOM CHECKBOX =====
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        padding: '0.35rem 0.5rem 0.35rem 0.25rem',
        margin: '-0.35rem -0.5rem -0.35rem -0.25rem',
        borderRadius: '4px',
        transition: 'background 0.15s ease'
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.background = 'rgba(139, 90, 43, 0.1)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '3px',
          background: checked 
            ? `linear-gradient(135deg, ${ACCENT_GOLD} 0%, ${ACCENT_GOLD_DIM} 100%)` 
            : 'rgba(0,0,0,0.4)',
          border: checked 
            ? `2px solid ${ACCENT_GOLD}` 
            : '2px solid rgba(90, 70, 50, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          boxShadow: checked ? '0 0 10px rgba(201, 162, 39, 0.3)' : 'none',
          flexShrink: 0
        }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path 
              d="M2 6L5 9L10 3" 
              stroke="#0a0806" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {label && (
        <span style={{ 
          fontSize: '0.9rem',
          color: checked ? '#e8dcc4' : '#7a6c56',
          fontWeight: checked ? 600 : 400,
          transition: 'all 0.2s ease'
        }}>
          {label}
        </span>
      )}
    </div>
  );
}

// ===== CUSTOM SELECT =====
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function Select({ value, onChange, options, disabled, style }: SelectProps) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        style={{
          appearance: 'none',
          width: '100%',
          padding: '0.5rem 2rem 0.5rem 0.75rem',
          fontSize: '0.85rem',
          fontFamily: "'Crimson Text', Georgia, serif",
          fontWeight: 500,
          color: disabled ? '#7a6c56' : '#e8dcc4',
          background: 'linear-gradient(135deg, rgba(35, 28, 20, 0.9) 0%, rgba(25, 20, 15, 0.95) 100%)',
          border: '1px solid rgba(90, 70, 50, 0.5)',
          borderRadius: '3px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          outline: 'none',
          opacity: disabled ? 0.5 : 1
        }}
        onFocus={e => {
          if (!disabled) {
            e.target.style.borderColor = 'rgba(201, 162, 39, 0.5)';
            e.target.style.boxShadow = '0 0 10px rgba(201, 162, 39, 0.15)';
          }
        }}
        onBlur={e => {
          e.target.style.borderColor = 'rgba(90, 70, 50, 0.5)';
          e.target.style.boxShadow = 'none';
        }}
      >
        {options.map(opt => (
          <option 
            key={opt.value} 
            value={opt.value}
            style={{
              background: '#1a1510',
              color: '#e8dcc4',
              padding: '0.5rem'
            }}
          >
            {opt.label}
          </option>
        ))}
      </select>
      <div style={{
        position: 'absolute',
        right: '0.5rem',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        color: disabled ? '#7a6c56' : ACCENT_GOLD,
        opacity: disabled ? 0.5 : 1
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </div>
    </div>
  );
}

// ===== CUSTOM NUMBER INPUT =====
interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  suffix?: string;
  style?: React.CSSProperties;
}

export function NumberInput({ value, onChange, min = 0, max = 100, disabled, suffix, style }: NumberInputProps) {
  const handleChange = (newValue: number) => {
    const clamped = Math.max(min, Math.min(max, newValue));
    onChange(clamped);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      opacity: disabled ? 0.5 : 1,
      ...style
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(180deg, rgba(35, 28, 20, 0.95) 0%, rgba(25, 20, 15, 0.95) 100%)',
        border: '1px solid rgba(90, 70, 50, 0.5)',
        borderRadius: '3px',
        overflow: 'hidden'
      }}>
        <button
          type="button"
          onClick={() => handleChange(value - 1)}
          disabled={disabled || value <= min}
          style={{
            width: '28px',
            height: '32px',
            border: 'none',
            background: 'transparent',
            color: disabled || value <= min ? '#5a4a3a' : ACCENT_GOLD,
            cursor: disabled || value <= min ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => {
            if (!disabled && value > min) {
              e.currentTarget.style.background = 'rgba(139, 90, 43, 0.15)';
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={e => handleChange(parseInt(e.target.value) || 0)}
          disabled={disabled}
          min={min}
          max={max}
          style={{
            width: '50px',
            height: '32px',
            border: 'none',
            borderLeft: '1px solid rgba(90, 70, 50, 0.3)',
            borderRight: '1px solid rgba(90, 70, 50, 0.3)',
            background: 'transparent',
            color: disabled ? '#7a6c56' : '#e8dcc4',
            fontSize: '0.9rem',
            fontWeight: 600,
            textAlign: 'center',
            fontFamily: "'JetBrains Mono', monospace",
            outline: 'none',
            MozAppearance: 'textfield'
          }}
        />
        <button
          type="button"
          onClick={() => handleChange(value + 1)}
          disabled={disabled || value >= max}
          style={{
            width: '28px',
            height: '32px',
            border: 'none',
            background: 'transparent',
            color: disabled || value >= max ? '#5a4a3a' : ACCENT_GOLD,
            cursor: disabled || value >= max ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => {
            if (!disabled && value < max) {
              e.currentTarget.style.background = 'rgba(139, 90, 43, 0.15)';
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          +
        </button>
      </div>
      {suffix && (
        <span style={{ 
          fontSize: '0.85rem', 
          color: '#7a6c56',
          fontWeight: 500
        }}>
          {suffix}
        </span>
      )}
    </div>
  );
}

// ===== CUSTOM TOGGLE SWITCH =====
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      userSelect: 'none'
    }}>
      <div
        onClick={() => !disabled && onChange(!checked)}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          background: checked 
            ? `linear-gradient(135deg, ${ACCENT_GOLD} 0%, ${ACCENT_GOLD_DIM} 100%)` 
            : 'rgba(90, 70, 50, 0.3)',
          border: checked 
            ? `1px solid rgba(201, 162, 39, 0.5)` 
            : '1px solid rgba(90, 70, 50, 0.5)',
          position: 'relative',
          transition: 'all 0.25s ease',
          boxShadow: checked ? '0 0 12px rgba(201, 162, 39, 0.25)' : 'inset 0 2px 4px rgba(0,0,0,0.3)',
          flexShrink: 0
        }}
      >
        <div style={{
          position: 'absolute',
          top: '2px',
          left: checked ? '22px' : '2px',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: checked 
            ? '#f5edd8' 
            : 'rgba(184, 168, 140, 0.5)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          transition: 'all 0.25s ease'
        }} />
      </div>
      {label && (
        <span style={{ 
          fontSize: '0.9rem',
          color: checked ? '#e8dcc4' : '#7a6c56',
          fontWeight: checked ? 600 : 400,
          transition: 'all 0.2s ease'
        }}>
          {label}
        </span>
      )}
    </label>
  );
}

// ===== BUTTON GROUP =====
interface ButtonOption {
  value: string;
  label: string;
  icon?: string;
}

interface ButtonGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: ButtonOption[];
  disabled?: boolean;
}

export function ButtonGroup({ value, onChange, options, disabled }: ButtonGroupProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '0.25rem',
      background: 'rgba(0,0,0,0.3)',
      borderRadius: '4px',
      padding: '0.25rem',
      opacity: disabled ? 0.5 : 1
    }}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => !disabled && onChange(opt.value)}
          disabled={disabled}
          style={{
            flex: 1,
            padding: '0.5rem 0.75rem',
            borderRadius: '3px',
            background: value === opt.value 
              ? 'linear-gradient(135deg, rgba(201, 162, 39, 0.25) 0%, rgba(139, 105, 20, 0.15) 100%)'
              : 'transparent',
            color: value === opt.value ? ACCENT_GOLD : '#7a6c56',
            fontSize: '0.8rem',
            fontWeight: value === opt.value ? 600 : 500,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            border: value === opt.value 
              ? '1px solid rgba(201, 162, 39, 0.3)' 
              : '1px solid transparent',
            whiteSpace: 'nowrap',
            fontFamily: "'Crimson Text', Georgia, serif"
          }}
          onMouseEnter={e => {
            if (!disabled && value !== opt.value) {
              e.currentTarget.style.background = 'rgba(139, 90, 43, 0.1)';
              e.currentTarget.style.color = '#b8a88c';
            }
          }}
          onMouseLeave={e => {
            if (value !== opt.value) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#7a6c56';
            }
          }}
        >
          {opt.icon && <span style={{ marginRight: '0.25rem' }}>{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ===== SLIDER =====
interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  valueColor?: (value: number) => string;
}

export function Slider({ 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  disabled,
  showValue = true,
  valueColor
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const color = valueColor ? valueColor(value) : ACCENT_GOLD;
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      opacity: disabled ? 0.5 : 1
    }}>
      <div style={{ flex: 1, position: 'relative', height: '24px', display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '6px',
          background: 'rgba(90, 70, 50, 0.3)',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color} 0%, ${color}cc 100%)`,
            borderRadius: '3px',
            transition: 'width 0.1s ease',
            boxShadow: `0 0 8px ${color}40`
          }} />
        </div>
        <input
          type="range"
          value={value}
          onChange={e => onChange(parseInt(e.target.value))}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          style={{
            position: 'absolute',
            width: '100%',
            height: '24px',
            opacity: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
            margin: 0
          }}
        />
        <div style={{
          position: 'absolute',
          left: `calc(${percentage}% - 9px)`,
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: '#f5edd8',
          boxShadow: `0 2px 6px rgba(0,0,0,0.4), 0 0 8px ${color}30`,
          border: `2px solid ${color}`,
          transition: 'left 0.1s ease',
          pointerEvents: 'none'
        }} />
      </div>
      {showValue && (
        <span style={{
          minWidth: '2.5rem',
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '1.1rem',
          color: color,
          fontFamily: "'JetBrains Mono', monospace"
        }}>
          {value}
        </span>
      )}
    </div>
  );
}

