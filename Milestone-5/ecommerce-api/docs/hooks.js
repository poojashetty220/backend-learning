const hooks = require('hooks');
const https = require('https');

let testUserId = null;
let testOrderId = null;
const apiBase = 'https://qkcu8k48s9.execute-api.ap-south-1.amazonaws.com/dev';

// Create test user before tests
hooks.beforeAll((transactions, done) => {
  const userData = {
    name: 'Test User',
    email: `testuser${Date.now()}@example.com`,
    password: 'testpass123',
    shippingAddress: '123 Test St'
  };
  
  const postData = JSON.stringify(userData);
  const options = {
    hostname: 'qkcu8k48s9.execute-api.ap-south-1.amazonaws.com',
    port: 443,
    path: '/dev/api/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };
  
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 201) {
        const user = JSON.parse(data);
        testUserId = user._id;
      }
      done();
    });
  });
  
  req.on('error', () => done());
  req.write(postData);
  req.end();
});

hooks.beforeEach((transaction, done) => {
  if (transaction.request.method === 'DELETE') {
    transaction.skip = true;
    return done();
  }
  
  // Add test token for authentication
  transaction.request.headers['Authorization'] = 'Bearer test-token-123';
  
  // Replace with real test user ID or fake ID for 404 tests
  const useRealId = transaction.name.includes('200');
  const userId = useRealId && testUserId ? testUserId : '507f1f77bcf86cd799439011';
  
  const orderId = testOrderId || '507f1f77bcf86cd799439011';
  
  transaction.fullPath = transaction.fullPath
    .replace(/EXISTING_USER_ID/g, userId)
    .replace(/ORDER123/g, orderId)
    .replace(/PRODUCT123/g, '507f1f77bcf86cd799439011');
  
  if (transaction.request.body) {
    transaction.request.body = transaction.request.body
      .replace(/EXISTING_USER_ID/g, userId)
      .replace(/ORDER123/g, '507f1f77bcf86cd799439011')
      .replace(/PRODUCT123/g, '507f1f77bcf86cd799439011');
  }
  
  // Unique email for registration and profile updates
  if (transaction.request.uri === '/api/register' && transaction.request.method === 'POST') {
    const body = JSON.parse(transaction.request.body);
    body.email = `test${Date.now()}${Math.random().toString(36).substr(2, 5)}@example.com`;
    transaction.request.body = JSON.stringify(body);
  }
  
  if (transaction.request.uri === '/api/profile' && transaction.request.method === 'PATCH') {
    const body = JSON.parse(transaction.request.body);
    body.email = `updated${Date.now()}${Math.random().toString(36).substr(2, 5)}@example.com`;
    transaction.request.body = JSON.stringify(body);
  }
  
  // Add item to cart before checkout
  if (transaction.request.uri === '/api/checkout' && transaction.request.method === 'POST') {
    const body = JSON.parse(transaction.request.body);
    body.userId = testUserId || '507f1f77bcf86cd799439011';
    transaction.request.body = JSON.stringify(body);
  }
  
  done();
});

// Add cart item before checkout test
hooks.before('/api/checkout > POST > 201', (transaction, done) => {
  if (!testUserId) return done();
  
  const cartData = JSON.stringify({
    userId: testUserId,
    productId: '507f1f77bcf86cd799439011'
  });
  
  const options = {
    hostname: 'qkcu8k48s9.execute-api.ap-south-1.amazonaws.com',
    port: 443,
    path: '/dev/api/cart/add',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test-token-123',
      'Content-Length': cartData.length
    }
  };
  
  const req = https.request(options, () => done());
  req.on('error', () => done());
  req.write(cartData);
  req.end();
});

// Store order ID after checkout
hooks.after('/api/checkout > POST > 201', (transaction, done) => {
  if (transaction.real.statusCode === 201) {
    const response = JSON.parse(transaction.real.body);
    if (response._id) {
      testOrderId = response._id;
    }
  }
  done();
});


