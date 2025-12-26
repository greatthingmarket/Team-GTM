// scripts/map-project.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const outputFile = path.join(rootDir, 'PROJECT_CONTEXT.md');

// 1. CONFIGURATION
// -------------------------------------------------------
// Dossiers à ignorer dans l'arborescence
const ignoreList = ['.git', 'node_modules', 'dist', '.astro', '.vscode', 'package-lock.json', 'pnpm-lock.yaml'];

// Fichiers de configuration critiques (lus intégralement)
const criticalFiles = [
  'package.json', 
  'astro.config.mjs', 
  'tailwind.config.js', 
  'tsconfig.json'
];

// Dossiers dont on veut lire TOUT le code source (Récursivement)
const dirsToRead = [
  'src/pages',
  'src/layouts',
  'src/content/config.ts', // Juste la config, pas tous les articles
  'src/components/Header.jsx' // Exemple spécifique
];

// Extensions autorisées (pour ne pas lire les images/binaires)
const allowedExtensions = ['.astro', '.js', '.jsx', '.ts', '.tsx', '.md', '.mdx', '.json', '.css'];
// -------------------------------------------------------

// Fonction pour générer l'arbre des fichiers
function getTree(dir, depth = 0) {
  if (depth > 4) return ''; 
  let output = '';
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    if (ignoreList.includes(file)) return;
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    const indent = '  '.repeat(depth);

    if (stats.isDirectory()) {
      output += `${indent}📁 ${file}/\n`;
      output += getTree(fullPath, depth + 1);
    } else {
      output += `${indent}📄 ${file}\n`;
    }
  });
  return output;
}

// Fonction pour lire le contenu d'un fichier ou dossier récursivement
function readContentRecursive(targetPath) {
  let content = '';
  
  // Si c'est un fichier spécifique
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
     return `\n### ${path.relative(rootDir, targetPath)}\n\`\`\`${path.extname(targetPath).substring(1)}\n${fs.readFileSync(targetPath, 'utf-8')}\n\`\`\`\n`;
  }

  // Si c'est un dossier, on cherche dedans
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
    const files = fs.readdirSync(targetPath);
    files.forEach(file => {
      const fullPath = path.join(targetPath, file);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        content += readContentRecursive(fullPath);
      } else {
        const ext = path.extname(fullPath);
        if (allowedExtensions.includes(ext)) {
          content += `\n### ${path.relative(rootDir, fullPath)}\n\`\`\`${ext.substring(1)}\n${fs.readFileSync(fullPath, 'utf-8')}\n\`\`\`\n`;
        }
      }
    });
  }
  return content;
}

function generateContext() {
  let content = `# PROJECT ANALYSIS FOR AI\n\n`;
  
  console.log("🌳 Génération de l'arborescence...");
  content += `## 1. FILE STRUCTURE\n\`\`\`text\n${getTree(rootDir)}\n\`\`\`\n\n`;

  console.log("⚙️ Lecture des configurations...");
  content += `## 2. CRITICAL CONFIGURATIONS\n`;
  criticalFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      content += `\n### ${file}\n\`\`\`${path.extname(file).substring(1)}\n${fs.readFileSync(filePath, 'utf-8')}\n\`\`\`\n`;
    }
  });

  console.log("📖 Lecture du code source source...");
  content += `## 3. SOURCE CODE CONTENT\n`;
  dirsToRead.forEach(dir => {
    const targetPath = path.join(rootDir, dir);
    content += readContentRecursive(targetPath);
  });

  fs.writeFileSync(outputFile, content);
  console.log(`✅ Terminé ! Fichier généré : ${outputFile}`);
}

generateContext();