// scripts/post-build.js
/**
 * Script exécuté automatiquement après chaque build Netlify
 * Notifie IndexNow des nouvelles URLs
 */

import https from 'https';

// ⚠️ IMPORTANT : Remplacez par votre domaine de production
const SITE_URL = process.env.URL || 'https://greatthingmarket.com';
const DEPLOY_CONTEXT = process.env.CONTEXT; // "production", "deploy-preview", "branch-deploy"

/**
 * Envoie une requête POST à l'API IndexNow
 */
function notifyIndexNow() {
  return new Promise((resolve, reject) => {
    // Uniquement en production
    if (DEPLOY_CONTEXT !== 'production') {
      console.log('⏭️  Skipping IndexNow notification (not production)');
      return resolve({ skipped: true });
    }

    console.log('📤 Notifying IndexNow after successful deployment...');

    const postData = JSON.stringify({ sitemap: true });

    const options = {
      hostname: new URL(SITE_URL).hostname,
      port: 443,
      path: '/api/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode === 200 && result.success) {
            console.log('✅ IndexNow notification successful:', result.message);
            resolve(result);
          } else {
            console.error('❌ IndexNow notification failed:', result.message || data);
            reject(new Error(result.message || 'Unknown error'));
          }
        } catch (error) {
          console.error('❌ Failed to parse IndexNow response:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ IndexNow request failed:', error.message);
      reject(error);
    });

    // Timeout de 30 secondes
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Fonction principale
 */
async function main() {
  try {
    console.log('\n🚀 Running post-build script...');
    console.log(`   Context: ${DEPLOY_CONTEXT}`);
    console.log(`   Site URL: ${SITE_URL}\n`);

    await notifyIndexNow();

    console.log('\n✅ Post-build script completed successfully\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Post-build script failed:', error.message);
    // Ne pas bloquer le déploiement en cas d'erreur IndexNow
    console.log('⚠️  Deployment will continue despite IndexNow error\n');
    process.exit(0); // Exit 0 pour ne pas bloquer le build
  }
}

// Exécuter la fonction principale
main();