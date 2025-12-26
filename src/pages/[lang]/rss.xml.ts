// src/pages/[lang]/rss.xml.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export const getStaticPaths = () => {
  return [
    { params: { lang: 'en' } },
    { params: { lang: 'fr' } },
    { params: { lang: 'es' } },
    { params: { lang: 'de' } },
    { params: { lang: 'ar' } },
    { params: { lang: 'pt' } },
  ];
};

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang || 'en';
  const siteUrl = 'https://greatthingmarket.com';
  
  // Titres traduits pour le flux lui-même
  const titles: Record<string, string> = {
    en: 'Great Thing Market - Best Deals',
    fr: 'Great Thing Market - Meilleures Offres',
    es: 'Great Thing Market - Mejores Ofertas',
    de: 'Great Thing Market - Beste Angebote',
    ar: 'Great Thing Market - أفضل العروض',
    pt: 'Great Thing Market - Melhores Ofertas',
  };

  try {
    // Récupérer et filtrer les articles par langue
    const allPosts = await getCollection('blog');
    const blogPosts = allPosts.filter(post => post.id.startsWith(`${lang}/`));
    
    const sortedPosts = blogPosts.sort((a, b) => {
      return new Date(b.data.date || 0).getTime() - new Date(a.data.date || 0).getTime();
    });

    const escapeXml = (unsafe: string) => unsafe.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":"&apos;"}[c] || c));

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(titles[lang])}</title>
    <link>${siteUrl}/${lang}/blog</link>
    <description>Best deals and reviews in ${lang}</description>
    <language>${lang}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/${lang}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/assets/logo-512.png</url>
      <title>${escapeXml(titles[lang])}</title>
      <link>${siteUrl}/${lang}/blog</link>
    </image>
${sortedPosts.slice(0, 20).map((post) => {
  const postUrl = `${siteUrl}/${lang}/blog/${post.slug.split('/').pop()}`;
  const imageUrl = post.data.image ? `${siteUrl}${post.data.image}` : `${siteUrl}/assets/logo-512.png`;
  return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.data.description)}</description>
      <pubDate>${new Date(post.data.date || Date.now()).toUTCString()}</pubDate>
      <dc:creator>Great Thing Market</dc:creator>
      <enclosure url="${imageUrl}" type="image/jpeg" length="0"/>
      <content:encoded><![CDATA[<img src="${imageUrl}" alt="${escapeXml(post.data.title)}"/><p>${post.data.description}</p>]]></content:encoded>
    </item>`;
}).join('\n')}
  </channel>
</rss>`;

    return new Response(rss, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
  } catch (e) {
    return new Response('<rss version="2.0"><channel><title>Error</title></channel></rss>', { status: 500 });
  }
};