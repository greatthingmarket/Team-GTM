// src/pages/sitemap.xml.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export const GET: APIRoute = async () => {
  const siteUrl = 'https://greatthingmarket.com';
  const languages = ['en', 'fr', 'es', 'de', 'ar', 'pt'];
  const categories = ['home-gadgets', 'fashion-beauty', 'tech-accessories', 'monthly-deals'];
  
  interface SitemapUrl {
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: number;
  }
  
  const urls: SitemapUrl[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  // Homepage pour chaque langue
  languages.forEach(lang => {
    urls.push({
      loc: `${siteUrl}/${lang}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0,
    });
  });
  
  // Pages catégories pour chaque langue
  languages.forEach(lang => {
    categories.forEach(cat => {
      urls.push({
        loc: `${siteUrl}/${lang}/category/${cat}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.8,
      });
    });
  });
  
  // Articles de blog
  try {
    const blogPosts = await getCollection('blog');
    // ✅ CORRECTION : Typage explicite du paramètre post
    blogPosts.forEach((post: CollectionEntry<'blog'>) => {
      urls.push({
        loc: `${siteUrl}/blog/${post.slug}`,
        lastmod: post.data.date || today,
        changefreq: 'monthly',
        priority: 0.7,
      });
    });
  } catch (error) {
    console.warn('Error loading blog posts for sitemap:', error);
  }
  
  // Pages légales
  const legalPages = ['about', 'contact', 'privacy', 'terms', 'affiliate-disclosure'];
  languages.forEach(lang => {
    legalPages.forEach(page => {
      urls.push({
        loc: `${siteUrl}/${lang}/${page}`,
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.5,
      });
    });
  });
  
  // Génération XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};