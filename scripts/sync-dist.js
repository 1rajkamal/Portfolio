import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const distAssetsDir = path.resolve(distDir, 'assets');
const rootAssetsDir = path.resolve(rootDir, 'assets');

// 1. Ensure dist/index.html exists (if Vite built from index.dev.html, rename/copy it)
const distDevHtml = path.resolve(distDir, 'index.dev.html');
const distIndexHtml = path.resolve(distDir, 'index.html');
if (fs.existsSync(distDevHtml)) {
  fs.copyFileSync(distDevHtml, distIndexHtml);
}

// 2. Copy dist/index.html to root index.html
if (fs.existsSync(distIndexHtml)) {
  fs.copyFileSync(distIndexHtml, path.resolve(rootDir, 'index.html'));
  console.log('✓ Synced dist/index.html -> ./index.html');
}

// 3. Clean old JS/CSS files in root ./assets/ (preserving folders like images/)
if (fs.existsSync(rootAssetsDir)) {
  const existingFiles = fs.readdirSync(rootAssetsDir);
  for (const file of existingFiles) {
    const fullPath = path.resolve(rootAssetsDir, file);
    if (fs.statSync(fullPath).isFile() && (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.map'))) {
      fs.unlinkSync(fullPath);
    }
  }
} else {
  fs.mkdirSync(rootAssetsDir, { recursive: true });
}

// 4. Copy fresh dist/assets/* to root ./assets/
if (fs.existsSync(distAssetsDir)) {
  const files = fs.readdirSync(distAssetsDir);
  for (const file of files) {
    const srcPath = path.resolve(distAssetsDir, file);
    const destPath = path.resolve(rootAssetsDir, file);
    fs.copyFileSync(srcPath, destPath);
  }
  console.log(`✓ Cleaned & synced ${files.length} fresh assets from dist/assets -> ./assets`);
}
