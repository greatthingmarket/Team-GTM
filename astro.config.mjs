import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';

export default defineConfig({
  integrations: [tailwind(), preact(), mdx()],
  
  // ✅ Sortie serveur pour Netlify
  output: 'server',
  adapter: netlify(),

  // ✅ INDISPENSABLE : Autorise Cloudinary pour tes images et vidéos
  image: {
    domains: ['res.cloudinary.com'],
  },
  
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'es', 'de', 'ar', 'pt'], 
    routing: {
      prefixDefaultLocale: true
    }
  }
});