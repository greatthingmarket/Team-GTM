// src/pages/[lang]/rss.xml.ts
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { APIRoute } from 'astro';

export const prerender = true;

export async function getStaticPaths() {
  const languages = ['en', 'fr', 'es', 'de', 'ar', 'pt'];
  
  return languages.map(lang => ({
    params: { lang }
  }));
}

export const GET: APIRoute = async ({ params }) => {
  const { lang = 'en' } = params;
  
  try {
    const allPosts = await getCollection('blog');
    
    const blogPosts = allPosts.filter((post: CollectionEntry<'blog'>) => 
      post.id.startsWith(`${lang}/`)
    );
    
    const sortedPosts = blogPosts.sort((a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) => {
      const dateA = new Date(a.data.date).getTime();
      const dateB = new Date(b.data.date).getTime();
      return dateB - dateA;
    });
    
    const siteUrl = 'https://greatthingmarket.com';
    
    const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Great Thing Market - ${lang.toUpperCase()}</title>
    <link>${siteUrl}/${lang}/</link>
    <description>Best deals and product reviews</description>
    <language>${lang}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/${lang}/rss.xml" rel="self" type="application/rss+xml"/>
${sortedPosts.slice(0, 20).map((post: CollectionEntry<'blog'>) => {
  const [, ...slugParts] = post.id.split('/');
  const slug = slugParts.join('/').replace('.mdx', '');
  const postUrl = `${siteUrl}/${lang}/blog/${slug}`;
  const pubDate = new Date(post.data.date).toUTCString();
  
  return `    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <link>${postUrl}</link>
      <description><![CDATA[${post.data.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${postUrl}</guid>
    </item>`;
}).join('\n')}
  </channel>
</rss>`;

    return new Response(rssContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('RSS generation error:', error);
    return new Response('Error generating RSS feed', { status: 500 });
  }
};