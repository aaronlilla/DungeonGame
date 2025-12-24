import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Directories to search for PNG files
const searchDirs = [
  join(projectRoot, 'src', 'assets'),
  join(projectRoot, 'public')
];

let totalOriginalSize = 0;
let totalCompressedSize = 0;
let filesProcessed = 0;
let filesSkipped = 0;

async function getAllPngFiles(dir) {
  const files = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        const subFiles = await getAllPngFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory might not exist, skip it
    if (error.code !== 'ENOENT') {
      console.warn(`Warning: Could not read directory ${dir}: ${error.message}`);
    }
  }
  return files;
}

async function compressPng(filePath) {
  try {
    const stats = await stat(filePath);
    const originalSize = stats.size;
    totalOriginalSize += originalSize;

    // Read the image
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Compress with quality settings optimized for web
    // Using pngquant-like compression with quality 80-100
    const compressed = await image
      .png({
        quality: 85,
        compressionLevel: 9,
        palette: true, // Use palette mode when possible for better compression
        effort: 7 // Higher effort = better compression but slower
      })
      .toBuffer();

    const compressedSize = compressed.length;
    totalCompressedSize += compressedSize;

    // Only replace if we actually saved space
    if (compressedSize < originalSize) {
      // Write compressed version back to file
      const fs = await import('fs/promises');
      await fs.writeFile(filePath, compressed);
      
      const savings = originalSize - compressedSize;
      const savingsPercent = ((savings / originalSize) * 100).toFixed(1);
      
      console.log(`✓ ${filePath.replace(projectRoot, '.')}`);
      console.log(`  ${(originalSize / 1024).toFixed(1)} KB → ${(compressedSize / 1024).toFixed(1)} KB (${savingsPercent}% saved)`);
      
      filesProcessed++;
      return { saved: true, originalSize, compressedSize };
    } else {
      console.log(`⊘ ${filePath.replace(projectRoot, '.')} (no improvement)`);
      filesSkipped++;
      return { saved: false, originalSize, compressedSize: originalSize };
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}: ${error.message}`);
    return { saved: false, error: true };
  }
}

async function main() {
  console.log('🔍 Finding PNG files...\n');
  
  const allPngFiles = [];
  for (const dir of searchDirs) {
    if (existsSync(dir)) {
      const files = await getAllPngFiles(dir);
      allPngFiles.push(...files);
    }
  }

  console.log(`Found ${allPngFiles.length} PNG files to process\n`);
  console.log('Compressing...\n');

  // Process files sequentially to avoid overwhelming the system
  for (const file of allPngFiles) {
    await compressPng(file);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Compression Summary');
  console.log('='.repeat(60));
  console.log(`Files processed: ${filesProcessed}`);
  console.log(`Files skipped (no improvement): ${filesSkipped}`);
  console.log(`Total files: ${allPngFiles.length}`);
  console.log(`\nOriginal total size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Compressed total size: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`);
  
  if (totalOriginalSize > 0) {
    const totalSavings = totalOriginalSize - totalCompressedSize;
    const totalSavingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(1);
    console.log(`Total savings: ${(totalSavings / 1024 / 1024).toFixed(2)} MB (${totalSavingsPercent}%)`);
  }
  console.log('='.repeat(60));
}

main().catch(console.error);

