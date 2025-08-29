// tests/integration/test-frontend.js
// Tests d'intégration pour vérifier le frontend

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const BUILD_PATH = process.env.BUILD_PATH || '../../client/build';

// Fonction pour vérifier l'URL
function checkUrl(url) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: data,
          headers: res.headers
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => reject(new Error('Timeout')));
    req.end();
  });
}

// Fonction pour vérifier les fichiers de build
function checkBuildFiles() {
  const buildDir = path.resolve(__dirname, BUILD_PATH);
  
  try {
    if (!fs.existsSync(buildDir)) {
      throw new Error('Dossier build inexistant');
    }

    const indexPath = path.join(buildDir, 'index.html');
    if (!fs.existsSync(indexPath)) {
      throw new Error('Fichier index.html manquant');
    }

    const staticDir = path.join(buildDir, 'static');
    if (!fs.existsSync(staticDir)) {
      throw new Error('Dossier static manquant');
    }

    return true;
  } catch (error) {
    throw error;
  }
}

// Tests d'intégration frontend
async function runFrontendTests() {
  console.log('=== Tests d\'intégration Frontend ===');
  let failedTests = 0;
  let totalTests = 0;

  // Test 1: Vérifier les fichiers de build
  try {
    totalTests++;
    console.log('Test 1: Fichiers de build...');
    
    checkBuildFiles();
    console.log('Build files: OK');
  } catch (error) {
    failedTests++;
    console.log('Build files: ECHEC -', error.message);
  }

  // Test 2: Vérifier la connectivité frontend
  try {
    totalTests++;
    console.log('Test 2: Connectivité frontend...');
    
    const response = await checkUrl(FRONTEND_URL);
    
    if (response.statusCode === 200) {
      console.log('Frontend accessible: OK');
    } else {
      throw new Error(`Status code: ${response.statusCode}`);
    }
  } catch (error) {
    failedTests++;
    console.log('Frontend accessible: ECHEC -', error.message);
  }

  // Test 3: Vérifier le contenu HTML
  try {
    totalTests++;
    console.log('Test 3: Contenu HTML...');
    
    const response = await checkUrl(FRONTEND_URL);
    
    if (response.body.includes('<div id="root">')) {
      console.log('Structure React: OK');
    } else {
      throw new Error('Structure React non trouvée');
    }
  } catch (error) {
    failedTests++;
    console.log('Structure React: ECHEC -', error.message);
  }

  // Test 4: Test de performance
  try {
    totalTests++;
    console.log('Test 4: Performance frontend...');
    
    const startTime = Date.now();
    await checkUrl(FRONTEND_URL);
    const loadTime = Date.now() - startTime;
    
    if (loadTime < 3000) {
      console.log(`Performance: OK (${loadTime}ms)`);
    } else {
      throw new Error(`Trop lent: ${loadTime}ms`);
    }
  } catch (error) {
    failedTests++;
    console.log('Performance: ECHEC -', error.message);
  }

  // Résultats
  console.log('\n=== Résultats Frontend ===');
  console.log(`Total: ${totalTests}`);
  console.log(`Réussis: ${totalTests - failedTests}`);
  console.log(`Échoués: ${failedTests}`);
  
  if (failedTests > 0) {
    console.log('Tests frontend échoués');
    process.exit(1);
  } else {
    console.log('Tests frontend réussis');
    process.exit(0);
  }
}

// Lancer les tests
runFrontendTests().catch((error) => {
  console.error('Erreur tests frontend:', error);
  process.exit(1);
});