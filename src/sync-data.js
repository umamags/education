import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(__dirname, '../data');
const targetDir = path.join(__dirname, '../focus-app/public/data');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.json'));

files.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`✓ Copied ${file}`);
});

console.log(`\n✅ Synced ${files.length} data files to focus-app/public/data`);
