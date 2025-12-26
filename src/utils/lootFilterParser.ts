// Parser for Path of Exile .filter files
import type { FilterRule, FilterAction, FilterCondition, FilterStyle, LootFilterConfig, RGBColor } from '../types/lootFilter';

/**
 * Parse a PoE filter file content into a structured filter configuration
 */
export function parseFilterFile(content: string): LootFilterConfig {
  const lines = content.split('\n');
  const rules: FilterRule[] = [];
  let currentRule: Partial<FilterRule> | null = null;
  let priority = 0;
  
  // Extract metadata from header comments
  let name = 'Custom Filter';
  let version: string | undefined;
  let author: string | undefined;
  let strictness: string | undefined;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Extract metadata from header comments
    if (line.startsWith('#')) {
      if (line.includes('VERSION:')) {
        version = line.split('VERSION:')[1]?.trim();
      } else if (line.includes('AUTHOR:')) {
        author = line.split('AUTHOR:')[1]?.trim();
      } else if (line.includes('TYPE:') || line.includes('STRICT')) {
        const match = line.match(/\d+-?(STRICT|REGULAR|SOFT)/i);
        if (match) strictness = match[0];
      }
      
      // If we have a current rule, this might be its comment
      if (currentRule && line.startsWith('# ')) {
        currentRule.comment = line.substring(2).trim();
      }
      continue;
    }
    
    // Check for Show/Hide action
    if (line.startsWith('Show') || line.startsWith('Hide')) {
      // Save previous rule if exists
      if (currentRule && currentRule.action) {
        rules.push(currentRule as FilterRule);
      }
      
      // Start new rule
      const action = line.split(/\s+/)[0] as FilterAction;
      const comment = line.includes('#') ? line.split('#')[1].trim() : undefined;
      
      currentRule = {
        action,
        conditions: {},
        style: {},
        comment,
        priority: priority++
      };
      continue;
    }
    
    // Parse rule conditions and styles
    if (currentRule) {
      parseRuleLine(line, currentRule);
    }
  }
  
  // Add last rule
  if (currentRule && currentRule.action) {
    rules.push(currentRule as FilterRule);
  }
  
  return {
    name,
    version,
    author,
    strictness,
    rules
  };
}

/**
 * Parse a single line of a filter rule
 */
function parseRuleLine(line: string, rule: Partial<FilterRule>): void {
  // Remove inline comments
  const cleanLine = line.split('#')[0].trim();
  if (!cleanLine) return;
  
  // Split by whitespace but preserve quoted strings
  const tokens = cleanLine.match(/(?:[^\s"]+|"[^"]*")+/g);
  if (!tokens || tokens.length === 0) return;
  
  const keyword = tokens[0];
  const values = tokens.slice(1).map(t => t.replace(/"/g, ''));
  
  if (!rule.conditions) rule.conditions = {};
  if (!rule.style) rule.style = {};
  
  switch (keyword) {
    // Conditions
    case 'Rarity':
      rule.conditions.rarity = values;
      break;
      
    case 'BaseType':
      rule.conditions.baseType = parseStringList(cleanLine);
      break;
      
    case 'Class':
      rule.conditions.itemClass = parseStringList(cleanLine);
      break;
      
    case 'ItemLevel':
      rule.conditions.itemLevel = parseComparison(values);
      break;
      
    case 'DropLevel':
      rule.conditions.dropLevel = parseComparison(values);
      break;
      
    case 'Quality':
      rule.conditions.quality = parseComparison(values);
      break;
      
    case 'Sockets':
      rule.conditions.sockets = parseComparison(values);
      break;
      
    case 'LinkedSockets':
      rule.conditions.linkedSockets = parseInt(values[0]) || 0;
      break;
      
    case 'SocketGroup':
      rule.conditions.socketGroup = values.join('');
      break;
      
    case 'Corrupted':
      rule.conditions.corrupted = values[0] === 'True';
      break;
      
    case 'Identified':
      rule.conditions.identified = values[0] === 'True';
      break;
      
    case 'Mirrored':
      rule.conditions.mirrored = values[0] === 'True';
      break;
      
    case 'HasInfluence':
      rule.conditions.hasInfluence = values;
      break;
      
    case 'StackSize':
      rule.conditions.stackSize = parseComparison(values);
      break;
      
    case 'AreaLevel':
      rule.conditions.areaLevel = parseComparison(values);
      break;
      
    case 'MapTier':
      rule.conditions.mapTier = parseComparison(values);
      break;
      
    case 'Fractured':
      rule.conditions.fractured = values[0] === 'True';
      break;
      
    case 'Synthesised':
      rule.conditions.synthesised = values[0] === 'True';
      break;
      
    case 'Enchanted':
      rule.conditions.enchanted = values[0] === 'True';
      break;
      
    // Styles
    case 'SetFontSize':
      rule.style.fontSize = parseInt(values[0]) || 35;
      break;
      
    case 'SetTextColor':
      rule.style.textColor = parseColor(values);
      break;
      
    case 'SetBorderColor':
      rule.style.borderColor = parseColor(values);
      break;
      
    case 'SetBackgroundColor':
      rule.style.backgroundColor = parseColor(values);
      break;
      
    case 'PlayAlertSound':
      rule.style.playAlertSound = {
        id: parseInt(values[0]) || 1,
        volume: parseInt(values[1]) || 100
      };
      break;
      
    case 'PlayEffect':
      rule.style.playEffect = values[0];
      break;
      
    case 'MinimapIcon':
      rule.style.minimapIcon = {
        size: parseInt(values[0]) || 1,
        color: values[1] || 'White',
        shape: values[2] || 'Circle'
      };
      break;
  }
}

/**
 * Parse comparison operators (>=, <=, ==, <, >)
 */
function parseComparison(values: string[]): { min?: number; max?: number } {
  const result: { min?: number; max?: number } = {};
  
  if (values.length === 0) return result;
  
  const operator = values[0];
  const value = parseInt(values[1] || values[0]);
  
  if (operator === '>=' || operator === '>') {
    result.min = operator === '>=' ? value : value + 1;
  } else if (operator === '<=' || operator === '<') {
    result.max = operator === '<=' ? value : value - 1;
  } else if (operator === '==' || operator === '=') {
    result.min = value;
    result.max = value;
  } else {
    // No operator, just a number
    result.min = parseInt(operator);
    result.max = result.min;
  }
  
  return result;
}

/**
 * Parse RGB(A) color values
 */
function parseColor(values: string[]): string {
  const r = parseInt(values[0]) || 0;
  const g = parseInt(values[1]) || 0;
  const b = parseInt(values[2]) || 0;
  const a = values[3] ? parseInt(values[3]) / 255 : 1;
  
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Parse string lists (handles both == and quoted strings)
 */
function parseStringList(line: string): string[] {
  // Remove the keyword and == operator
  const content = line.replace(/^[A-Za-z]+\s*(==)?\s*/, '');
  
  // Match quoted strings
  const matches = content.match(/"([^"]*)"/g);
  if (matches) {
    return matches.map(m => m.replace(/"/g, ''));
  }
  
  // Fallback to space-separated
  return content.split(/\s+/).filter(s => s.length > 0);
}

/**
 * Convert RGB object to CSS rgba string
 */
export function rgbToString(color: RGBColor): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ?? 1})`;
}

/**
 * Convert PoE effect name to beam color
 */
export function effectToBeamColor(effect?: string): string {
  if (!effect) return 'White';
  
  const effectMap: Record<string, string> = {
    'Red': 'red',
    'Blue': 'blue',
    'Green': 'green',
    'Yellow': 'yellow',
    'Orange': 'orange',
    'Purple': 'purple',
    'Pink': 'pink',
    'White': 'white',
    'Grey': 'grey',
    'Gray': 'grey',
    'Brown': 'brown'
  };
  
  return effectMap[effect] || 'white';
}

