import fs from 'fs';
import path from 'path';

// Configuration des dossiers
const BLOG_DIR = './src/content/blog';
const LANGUAGES = ['en', 'fr', 'es', 'de', 'ar', 'pt'];

/**
 * Ce script parcourt tous les dossiers de langue et s'assure que 
 * les fichiers MDX portent le même nom partout.
 */
function harmonize() {
  console.log("🚀 Début de l'harmonisation des fichiers du blog...");

  LANGUAGES.forEach(lang => {
    const langPath = path.join(BLOG_DIR, lang);

    if (!fs.existsSync(langPath)) {
      console.warn(`⚠️ Dossier non trouvé : ${langPath}`);
      return;
    }

    const files = fs.readdirSync(langPath);

    files.forEach(file => {
      // 1. Mise en minuscule
      // 2. Remplacement des espaces par des tirets
      // 3. Suppression des caractères spéciaux
      const oldPath = path.join(langPath, file);
      const extension = path.extname(file);
      const nameWithoutExt = path.basename(file, extension);
      
      const newName = nameWithoutExt
        .toLowerCase()
        .normalize("NFD") // Supprime les accents
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '-') // Espaces -> tirets
        .replace(/[^a-z0-z0-9\-]/g, '') // Supprime le reste (spéciaux)
        + extension;

      const newPath = path.join(langPath, newName);

      if (oldPath !== newPath) {
        fs.renameSync(oldPath, newPath);
        console.log(`✅ Renommé : ${file} -> ${newName} (${lang})`);
      }
    });
  });

  console.log("✨ Harmonisation terminée !");
}

harmonize();