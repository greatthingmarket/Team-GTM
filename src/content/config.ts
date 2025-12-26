// src/content/config.ts
import { z, defineCollection } from 'astro:content';

/**
 * Configuration de la collection 'blog'
 * Ce schéma valide, nettoie et type les données de chaque fichier .mdx
 */
const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default('Great Thing Market'),
    
    // ✅ SOLUTION À L'ERREUR toISOString :
    // z.coerce.date() force la conversion de n'importe quel format de date 
    // présent dans le frontmatter en un objet Date valide.
    date: z.coerce.date(),
    
    image: z.string(), 
    
    // ✅ PROTECTION & TYPAGE DES CATÉGORIES :
    category: z.string()
      .transform((val: string) => {
        const lower = val.toLowerCase();
        if (lower.includes('home')) return 'home';
        if (lower.includes('tech')) return 'tech';
        if (lower.includes('fashion')) return 'fashion';
        if (lower.includes('deal')) return 'deals';
        if (lower.includes('health')) return 'health';
        return 'deals'; // Catégorie par défaut
      })
      // S'assure que la sortie est bien l'une des valeurs attendues
      .pipe(z.enum(['home', 'fashion', 'tech', 'deals', 'health']))
      .default('deals'),
    
    // Tags optionnels pour le SEO ou le filtrage
    tags: z.array(z.string()).optional().default([]),
    
    // Possibilité de marquer un article comme "draft" (brouillon)
    draft: z.boolean().optional().default(false),
  }),
});

// Export des collections pour Astro
export const collections = {
  'blog': blogCollection,
};