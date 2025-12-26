// scripts/post-build.js
/**
 * Script exécuté automatiquement après chaque build Netlify
 * Notifie les moteurs de recherche via IndexNow
 */

import https from 'https';
import { readFileSync } from 'fs';
import { join } from 'path';

const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://greatthingmarket.com';
const DEPLOY_CONTEXT = process.env.CONTEXT;
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;

/**
 * Soumet le sitemap à IndexNow (Google, Bing, Yandex)
 */
async function notifyIndexNow() {
  // Uniquement en production
  if (DEPLOY_CONTEXT !== 'production') {
    console.log('⏭️  Skipping IndexNow (not production)');
    return { skipped: true };
  }

  if (!INDEXNOW_KEY) {
    console.log('⚠️  INDEXNOW_KEY not configured, skipping notification');
    return { skipped: true };
  }

  console.log('📤 Notifying IndexNow...');

  const urls = [
    `${SITE_URL}/en/`,
    `${SITE_URL}/fr/`,
    `${SITE_URL}/es/`,
    `${SITE_URL}/de/`,
    `${SITE_URL}/ar/`,
    `${SITE_URL}/pt/`,
    // Ajoutez d'autres URLs importantes ici
  ];

  const postData = JSON.stringify({
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    urlList: urls,
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.indexnow.org',
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log(`✅ IndexNow notification sent (${res.statusCode})`);
          console.log(`   Submitted ${urls.length} URLs`);
          resolve({ success: true, statusCode: res.statusCode });
        } else {
          console.error(`❌ IndexNow failed (${res.statusCode}):`, data);
          resolve({ success: false, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ IndexNow request error:', error.message);
      resolve({ success: false, error: error.message });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.error('❌ IndexNow request timeout');
      resolve({ success: false, error: 'timeout' });
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Soumet le sitemap à Google Search Console
 */
async function notifyGoogle() {
  if (DEPLOY_CONTEXT !== 'production') {
    console.log('⏭️  Skipping Google notification (not production)');
    return { skipped: true };
  }

  console.log('📤 Notifying Google Search Console...');

  const sitemapUrl = `${SITE_URL}/sitemap-index.xml`;

  return new Promise((resolve) => {
    const options = {
      hostname: 'www.google.com',
      port: 443,
      path: `/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      method: 'GET',
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Google notified successfully');
        resolve({ success: true });
      } else {
        console.log(`⚠️  Google response: ${res.statusCode}`);
        resolve({ success: false, statusCode: res.statusCode });
      }
    });

    req.on('error', (error) => {
      console.error('❌ Google notification error:', error.message);
      resolve({ success: false, error: error.message });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ success: false, error: 'timeout' });
    });

    req.end();
  });
}

/**
 * Soumet le sitemap à Bing
 */
async function notifyBing() {
  if (DEPLOY_CONTEXT !== 'production') {
    console.log('⏭️  Skipping Bing notification (not production)');
    return { skipped: true };
  }

  console.log('📤 Notifying Bing Webmaster Tools...');

  const sitemapUrl = `${SITE_URL}/sitemap-index.xml`;

  return new Promise((resolve) => {
    const options = {
      hostname: 'www.bing.com',
      port: 443,
      path: `/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      method: 'GET',
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Bing notified successfully');
        resolve({ success: true });
      } else {
        console.log(`⚠️  Bing response: ${res.statusCode}`);
        resolve({ success: false, statusCode: res.statusCode });
      }
    });

    req.on('error', (error) => {
      console.error('❌ Bing notification error:', error.message);
      resolve({ success: false, error: error.message });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ success: false, error: 'timeout' });
    });

    req.end();
  });
}

/**
 * Fonction principale
 */
async function main() {
  console.log('\n🚀 Running post-build script...');
  console.log(`   Context: ${DEPLOY_CONTEXT}`);
  console.log(`   Site URL: ${SITE_URL}`);
  console.log(`   IndexNow Key: ${INDEXNOW_KEY ? '✅ Configured' : '❌ Missing'}\n`);

  try {
    // Exécuter toutes les notifications en parallèle
    const results = await Promise.allSettled([
      notifyIndexNow(),
      notifyGoogle(),
      notifyBing(),
    ]);

    console.log('\n📊 Results:');
    results.forEach((result, index) => {
      const names = ['IndexNow', 'Google', 'Bing'];
      if (result.status === 'fulfilled') {
        const status = result.value.skipped ? '⏭️  Skipped' : 
                      result.value.success ? '✅ Success' : '⚠️  Failed';
        console.log(`   ${names[index]}: ${status}`);
      } else {
        console.log(`   ${names[index]}: ❌ Error - ${result.reason}`);
      }
    });

    console.log('\n✅ Post-build script completed\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Post-build script error:', error.message);
    console.log('⚠️  Deployment continues despite error\n');
    process.exit(0); // Ne pas bloquer le déploiement
  }
}

// Exécuter
main();