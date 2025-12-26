// src/utils/indexnow.ts
/**
 * Service IndexNow pour notifier Bing/Yandex des nouvelles URLs
 * Documentation : https://www.indexnow.org/documentation
 */

// ⚠️ IMPORTANT : Remplacez par VOTRE clé API générée dans Bing Webmaster Tools
const INDEXNOW_KEY = '11d1ca57762a470c9f9115bb783e5faf'; // ← Votre clé ici (sans .txt)
const SITE_URL = 'https://greatthingmarket.com';

interface IndexNowResponse {
  success: boolean;
  message: string;
  statusCode?: number;
}

/**
 * Soumet une ou plusieurs URLs à IndexNow
 * @param urls - URL(s) à indexer (string ou array)
 * @returns Résultat de la soumission
 */
export async function submitToIndexNow(
  urls: string | string[]
): Promise<IndexNowResponse> {
  try {
    // Normaliser en array
    const urlList = Array.isArray(urls) ? urls : [urls];

    // Valider les URLs
    const validUrls = urlList.filter(url => {
      try {
        new URL(url);
        return url.startsWith(SITE_URL);
      } catch {
        console.warn(`❌ Invalid URL skipped: ${url}`);
        return false;
      }
    });

    if (validUrls.length === 0) {
      return {
        success: false,
        message: 'No valid URLs to submit',
      };
    }

    // Préparer le payload IndexNow
    const payload = {
      host: new URL(SITE_URL).hostname,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: validUrls,
    };

    console.log('📤 Submitting to IndexNow:', {
      urls: validUrls.length,
      firstUrl: validUrls[0],
    });

    // Envoyer à IndexNow (Bing, Yandex, etc.)
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    // Analyser la réponse
    if (response.ok) {
      console.log('✅ IndexNow submission successful');
      return {
        success: true,
        message: `Successfully submitted ${validUrls.length} URL(s)`,
        statusCode: response.status,
      };
    } else {
      const errorText = await response.text();
      console.error('❌ IndexNow error:', response.status, errorText);
      return {
        success: false,
        message: `IndexNow error: ${response.status} - ${errorText}`,
        statusCode: response.status,
      };
    }
  } catch (error) {
    console.error('❌ IndexNow submission failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Soumet toutes les URLs du sitemap à IndexNow
 * Utile pour une indexation initiale complète
 */
export async function submitSitemapToIndexNow(): Promise<IndexNowResponse> {
  try {
    // Récupérer le sitemap
    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    const response = await fetch(sitemapUrl);
    const sitemapXml = await response.text();

    // Extraire toutes les URLs du sitemap
    const urlMatches = sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g);
    const urls = Array.from(urlMatches, match => match[1]);

    console.log(`📋 Found ${urls.length} URLs in sitemap`);

    // Soumettre par batch de 10 000 URLs (limite IndexNow)
    const batchSize = 10000;
    const results: IndexNowResponse[] = [];

    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const result = await submitToIndexNow(batch);
      results.push(result);

      // Pause entre les batches pour éviter le rate limiting
      if (i + batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const successCount = results.filter(r => r.success).length;
    return {
      success: successCount > 0,
      message: `Submitted ${successCount}/${results.length} batches successfully`,
    };
  } catch (error) {
    console.error('❌ Sitemap submission failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Soumet automatiquement un article de blog après publication
 * @param slug - Le slug de l'article (ex: "air-fryer-review")
 * @param lang - La langue de l'article (ex: "en")
 */
export async function submitBlogPost(
  slug: string,
  lang: string = 'en'
): Promise<IndexNowResponse> {
  const url = `${SITE_URL}/${lang}/blog/${slug}`;
  return submitToIndexNow(url);
}

/**
 * Soumet une page de catégorie après mise à jour
 * @param categorySlug - Le slug de la catégorie (ex: "home-gadgets")
 * @param lang - La langue de la page
 */
export async function submitCategoryPage(
  categorySlug: string,
  lang: string = 'en'
): Promise<IndexNowResponse> {
  const url = `${SITE_URL}/${lang}/category/${categorySlug}`;
  return submitToIndexNow(url);
}

/**
 * Soumet la homepage pour toutes les langues
 */
export async function submitHomepages(): Promise<IndexNowResponse> {
  const languages = ['en', 'fr', 'es', 'de', 'ar', 'pt'];
  const urls = languages.map(lang => `${SITE_URL}/${lang}/`);
  return submitToIndexNow(urls);
}