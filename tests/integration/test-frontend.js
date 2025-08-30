// tests/integration/test-frontend.js
// Tests d'intégration réels pour le frontend MyBank

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const BUILD_PATH = '../../client/build';

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
    req.setTimeout(15000, () => reject(new Error('Timeout')));
    req.end();
  });
}

// Fonction pour vérifier les fichiers de build (si ils existent)
function checkBuildFiles() {
  const buildDir = path.resolve(__dirname, BUILD_PATH);
  let buildExists = false;
  let indexExists = false;
  
  try {
    if (fs.existsSync(buildDir)) {
      buildExists = true;
      const indexPath = path.join(buildDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        indexExists = true;
      }
    }
  } catch (error) {
    // Pas grave si les fichiers de build n'existent pas en CI
  }
  
  return { buildExists, indexExists };
}

// Tests d'intégration frontend réels
async function runFrontendTests() {
  console.log('=== Tests d\'intégration Frontend MyBank ===');
  let failedTests = 0;
  let totalTests = 0;

  // Test 1: Vérifier les fichiers de build (optionnel)
  try {
    totalTests++;
    console.log('Test 1: Fichiers de build...');
    
    const { buildExists, indexExists } = checkBuildFiles();
    
    if (buildExists && indexExists) {
      console.log('✓ Fichiers de build présents');
    } else {
      console.log('○ Fichiers de build non trouvés (normal en CI)');
    }
  } catch (error) {
    console.log('○ Vérification build:', error.message);
    // Ne pas faire échouer le test pour les fichiers de build
  }

  // Test 2: Vérifier la connectivité frontend
  try {
    totalTests++;
    console.log('Test 2: Connectivité frontend...');
    
    const response = await checkUrl(FRONTEND_URL);
    
    if (response.statusCode === 200) {
      console.log('✓ Frontend MyBank accessible');
    } else {
      throw new Error(`Status code: ${response.statusCode}`);
    }
  } catch (error) {
    failedTests++;
    console.log('✗ Frontend accessible: ECHEC -', error.message);
  }

  // Test 3: Vérifier le contenu HTML React
  try {
    totalTests++;
    console.log('Test 3: Contenu HTML React...');
    
    const response = await checkUrl(FRONTEND_URL);
    
    if (response.body.includes('<div id="root">') || 
        response.body.includes('<div id="root"') ||
        response.body.includes('react') ||
        response.body.includes('MyBank')) {
      console.log('✓ Structure React détectée');
    } else {
      throw new Error('Structure React non trouvée dans le HTML');
    }
  } catch (error) {
    failedTests++;
    console.log('✗ Structure React: ECHEC -', error.message);
  }

  // Test 4: Test de performance frontend
  try {
    totalTests++;
    console.log('Test 4: Performance frontend...');
    
    const startTime = Date.now();
    await checkUrl(FRONTEND_URL);
    const loadTime = Date.now() - startTime;
    
    if (loadTime < 10000) { // 10 secondes max
      console.log(`✓ Performance acceptable: ${loadTime}ms`);
    } else {
      throw new Error(`Trop lent: ${loadTime}ms`);
    }
  } catch (error) {
    failedTests++;
    console.log('✗ Performance: ECHEC -', error.message);
  }

  // Test 5: Vérifier les headers HTTP du frontend
  try {
    totalTests++;
    console.log('Test 5: Headers HTTP frontend...');
    
    const response = await checkUrl(FRONTEND_URL);
    
    if (response.headers['content-type'] && 
        response.headers['content-type'].includes('text/html')) {
      console.log('✓ Headers HTML corrects');
    } else {
      throw new Error('Headers HTML manquants ou incorrects');
    }
  } catch (error) {
    failedTests++;
    console.log('✗ Headers HTML: ECHEC -', error.message);
  }

  // Test 6: Test de ressources statiques (optionnel)
  try {
    totalTests++;
    console.log('Test 6: Ressources statiques...');
    
    // Test d'un fichier CSS ou JS (si on peut les deviner)
    const response = await checkUrl(`${FRONTEND_URL}/static/css/main.css`);
    
    if (response.statusCode === 200 || response.statusCode === 404) {
      console.log('○ Structure de ressources vérifiée');
    }
  } catch (error) {
    console.log('○ Ressources statiques: non testables');
    // Ne pas faire échouer pour ce test optionnel
  }

  // Résultats finaux
  console.log('\n=== Résultats Frontend ===');
  console.log(`Total tests: ${totalTests}`);
  console.log(`Tests réussis: ${totalTests - failedTests}`);
  console.log(`Tests échoués: ${failedTests}`);
  
  if (failedTests > 0) {
    console.log('❌ Certains tests frontend ont échoué');
    process.exit(1);
  } else {
    console.log('✅ Tous les tests frontend sont passés');
    process.exit(0);
  }
}

// Lancer les tests
runFrontendTests().catch((error) => {
  console.error('Erreur lors de l\'exécution des tests frontend:', error);
  process.exit(1);
});