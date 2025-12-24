/**
 * Asset Preloader
 * 
 * Preloads all game assets (images) and keeps them in memory
 * to prevent loading delays during gameplay.
 */

import { ALL_POE_BASE_ITEMS } from '../data/poeBaseItems';
import { ddsPathToPngUrl } from './itemArt';

// Use Vite's import.meta.glob to dynamically import all images
// This will discover all images at build time
// Using multiple patterns to ensure we catch all image types
const pngModules = import.meta.glob('../assets/**/*.png', { 
  eager: true, 
  as: 'url' 
}) as Record<string, string>;

const jpgModules = import.meta.glob('../assets/**/*.{jpg,jpeg}', { 
  eager: true, 
  as: 'url' 
}) as Record<string, string>;

const webpModules = import.meta.glob('../assets/**/*.webp', { 
  eager: true, 
  as: 'url' 
}) as Record<string, string>;

// Combine all image modules
const allImageModules = { ...pngModules, ...jpgModules, ...webpModules };

// Cache for preloaded images to keep them in memory
const imageCache = new Map<string, HTMLImageElement>();

/**
 * Preload a single image and cache it
 */
function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    // Check if already cached
    if (imageCache.has(url)) {
      resolve();
      return;
    }

    const img = new Image();
    img.onload = () => {
      // Store in cache to keep in memory
      imageCache.set(url, img);
      resolve();
    };
    img.onerror = () => {
      // Don't fail on error, just continue
      // Still cache the failed image to avoid retrying
      imageCache.set(url, img);
      resolve();
    };
    img.src = url;
  });
}

/**
 * Get all static image URLs from the assets folder
 */
function getAllStaticImageUrls(): string[] {
  const urls = new Set<string>();
  
  // Add all images discovered by Vite's glob
  Object.values(allImageModules).forEach(url => {
    urls.add(url);
  });
  
  return Array.from(urls);
}

/**
 * Get all item art URLs from base items
 */
function getAllItemArtUrls(): string[] {
  const urls = new Set<string>();
  
  for (const baseItem of ALL_POE_BASE_ITEMS) {
    if (baseItem.visualIdentity?.ddsFile) {
      const url = ddsPathToPngUrl(baseItem.visualIdentity.ddsFile);
      if (url) {
        urls.add(url);
      }
    }
  }
  
  return Array.from(urls);
}

/**
 * Preload all game assets
 * @param onProgress Optional callback for progress updates (0-100)
 */
export async function preloadAllAssets(onProgress?: (progress: number) => void): Promise<void> {
  // Get all image URLs
  const staticImages = getAllStaticImageUrls();
  const itemArtUrls = getAllItemArtUrls();
  
  const allUrls = [...staticImages, ...itemArtUrls];
  const totalCount = allUrls.length;
  
  if (totalCount === 0) {
    onProgress?.(100);
    return;
  }
  
  // Load in batches to avoid overwhelming the browser
  const batchSize = 25;
  let loadedCount = 0;
  
  for (let i = 0; i < allUrls.length; i += batchSize) {
    const batch = allUrls.slice(i, i + batchSize);
    await Promise.all(batch.map(url => preloadImage(url)));
    loadedCount += batch.length;
    
    const progress = Math.round((loadedCount / totalCount) * 100);
    onProgress?.(progress);
  }
  
  // Log summary in dev mode
  if (import.meta.env.DEV) {
    console.log(`[AssetPreloader] Preloaded ${loadedCount} images (${staticImages.length} static, ${itemArtUrls.length} item art)`);
    console.log(`[AssetPreloader] Cache size: ${imageCache.size} images`);
  }
}

/**
 * Get the cached image for a URL (if preloaded)
 */
export function getCachedImage(url: string): HTMLImageElement | null {
  return imageCache.get(url) || null;
}

/**
 * Clear the image cache (useful for memory management if needed)
 */
export function clearImageCache(): void {
  imageCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; urls: string[] } {
  return {
    size: imageCache.size,
    urls: Array.from(imageCache.keys())
  };
}

