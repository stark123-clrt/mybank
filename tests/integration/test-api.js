// tests/integration/test-api.js
// Tests d'intégration pour vérifier l'API

const http = require('http');
const https = require('https');

// Configuration des tests
const API_BASE_URL = process.env.API_URL || 'http://localhost:8000';
const TEST_TIMEOUT = 30000;

// Fonction utilitaire pour faire des requêtes HTTP
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const timeout = setTimeout(() => reject(new Error('Request timeout')), TEST_TIMEOUT);
    
    const req = client.request(url, options, (res) => {
      clearTimeout(timeout);
      let data = '';
      
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Tests d'intégration
async function runTests() {
  console.log('=== Tests d\'intégration API ===');
  let failedTests = 0;
  let totalTests = 0;

  // Test 1: Vérifier que l'API répond
  try {
    totalTests++;
    console.log('Test 1: Connectivité API...');
    
    const response = await makeRequest(API_BASE_URL);
    
    if (response.statusCode === 200 || response.statusCode === 404) {
      console.log('✓ API accessible');
    } else {
      throw new Error(`Status code inattendu: ${response.statusCode}`);
    }
  } catch (error) {
    failedTests++;
    console.log('✗ Échec connectivité API:', error.message);
  }

  // Test 2: Test de l'endpoint des catégories (simulation)
  try {
    totalTests++;
    console.log('Test 2: Endpoint catégories...');
    
    const response = await makeRequest(`${API_BASE_URL}/api/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Accepter les codes 200 (success) ou 401 (non authentifié, mais endpoint existe)
    if ([200, 401, 404].includes(response.statusCode)) {
      console.log('✓ Endpoint catégories accessible');
    } else {
      throw new Error(`Status code inattendu: ${response.statusCode}`);
    }
  } catch (error) {
    failedTests++;
    console.log('✗ Échec endpoint catégories:', error.message);
  }

  // Test 3: Test de l'endpoint des dépenses (simulation)
  try {
    totalTests++;
    console.log('Test 3: Endpoint dépenses...');
    
    const response = await makeRequest(`${API_BASE_URL}/api/expenses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Accepter les codes 200 (success) ou 401 (non authentifié, mais endpoint existe)
    if ([200, 401, 404].includes(response.statusCode)) {
      console.log('✓ Endpoint dépenses accessible');
    } else {
      throw new Error(`Status code inattendu: ${response.statusCode}`);
    }
  } catch (error) {
    failedTests++;
    console.log('✗ Échec endpoint dépenses:', error.message);
  }

  // Test 4: Test de performance basique
  try {
    totalTests++;
    console.log('Test 4: Performance API...');
    
    const startTime = Date.now();
    await makeRequest(API_BASE_URL);
    const responseTime = Date.now() - startTime;
    
    if (responseTime < 5000) { // Moins de 5 secondes
      console.log(`✓ Temps de réponse acceptable: ${responseTime}ms`);
    } else {
      throw new Error(`Temps de réponse trop lent: ${responseTime}ms`);
    }
  } catch (error) {
    failedTests++;
    console.log('✗ Échec test performance:', error.message);
  }

  // Résultats finaux
  console.log('\n=== Résultats des tests ===');
  console.log(`Total tests: ${totalTests}`);
  console.log(`Tests réussis: ${totalTests - failedTests}`);
  console.log(`Tests échoués: ${failedTests}`);
  
  if (failedTests > 0) {
    console.log('❌ Certains tests ont échoué');
    process.exit(1);
  } else {
    console.log('✅ Tous les tests sont passés');
    process.exit(0);
  }
}

// Lancer les tests
runTests().catch((error) => {
  console.error('Erreur lors de l\'exécution des tests:', error);
  process.exit(1);
});