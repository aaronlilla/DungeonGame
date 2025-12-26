// Utility to load and apply loot filters
import { parseFilterFile } from './lootFilterParser';
import type { LootFilterConfig } from '../types/lootFilter';

/**
 * Load a loot filter from a file
 */
export async function loadFilterFromFile(file: File): Promise<LootFilterConfig> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const filter = parseFilterFile(content);
        resolve(filter);
      } catch (error) {
        reject(new Error(`Failed to parse filter: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read filter file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Load a loot filter from a URL or path
 */
export async function loadFilterFromUrl(url: string): Promise<LootFilterConfig> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    return parseFilterFile(content);
  } catch (error) {
    throw new Error(`Failed to load filter from URL: ${error}`);
  }
}

/**
 * Save filter config to localStorage
 */
export function saveFilterToStorage(filter: LootFilterConfig): void {
  try {
    localStorage.setItem('lootFilter', JSON.stringify(filter));
  } catch (error) {
    console.error('Failed to save filter to storage:', error);
  }
}

/**
 * Load filter config from localStorage
 */
export function loadFilterFromStorage(): LootFilterConfig | null {
  try {
    const stored = localStorage.getItem('lootFilter');
    if (!stored) return null;
    return JSON.parse(stored) as LootFilterConfig;
  } catch (error) {
    console.error('Failed to load filter from storage:', error);
    return null;
  }
}

/**
 * Clear filter from localStorage
 */
export function clearFilterFromStorage(): void {
  try {
    localStorage.removeItem('lootFilter');
  } catch (error) {
    console.error('Failed to clear filter from storage:', error);
  }
}

