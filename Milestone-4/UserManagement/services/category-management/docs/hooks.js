const hooks = require('hooks');
const AWS = require('aws-sdk');
const url = require('url');
const fs = require('fs');

// ===== Utility Functions =====
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

function log(message) {
  const logMessage = `${new Date().toISOString()} ${message}\n`;
  fs.appendFileSync('hooks.log', logMessage);
}

// ===== AWS SigV4 Signing =====
function signRequest(transaction) {
  const apiBase = 'https://28ztpnjp9j.execute-api.ap-south-1.amazonaws.com/dev';
  const parsedUrl = url.parse(`${apiBase}${transaction.request.uri}`);
  const endpoint = new AWS.Endpoint(parsedUrl.host);

  const request = new AWS.HttpRequest(endpoint, 'ap-south-1');
  request.method = transaction.request.method;
  request.path = `/dev${transaction.request.uri}`;
  request.headers['Host'] = parsedUrl.host;
  request.headers['Content-Type'] = 'application/json';
  request.body = transaction.request.body || '';

  // Sign request using AWS credentials from environment
  const signer = new AWS.Signers.V4(request, 'execute-api');
  signer.addAuthorization(AWS.config.credentials, new Date());

  // Apply signed headers to transaction
  Object.entries(request.headers).forEach(([key, value]) => {
    transaction.request.headers[key] = value;
  });

  log(`Signed request for ${transaction.name}`);
}

// ===== AFTER EACH HOOK =====
hooks.afterEach((transaction, done) => {
  log(`Transaction: ${transaction.name} - Expected ${transaction.expected.statusCode}`);

  if (transaction.expected.statusCode === '500') {
    transaction.skip = true;
    log(`Skipping ${transaction.name} → Expected 500`);
  }
  if (transaction.request.method === 'DELETE') {
    transaction.skip = true;
    log(`Skipping ${transaction.name} → DELETE request`);
  }
  if (
    transaction.request.uri === '/categories/6732ec11522857d5ad97dbc4' &&
    transaction.request.method === 'GET' &&
    transaction.expected.statusCode === '409'
  ) {
    transaction.skip = true;
    log(`Skipping ${transaction.name} → Expected 409 GET`);
  }

  done();
});

// ===== BEFORE EACH HOOK =====
hooks.beforeEach((transaction, done) => {
  // Skip signing for 401 tests
  if (transaction.expected.statusCode !== '401') {
    signRequest(transaction);
  }

  // POST /categories
  if (transaction.request.uri === '/categories' && transaction.request.method === 'POST') {
    if (transaction.expected.statusCode === '400') {
      transaction.request.body = JSON.stringify({});
    }
    if (transaction.expected.statusCode === '201') {
      transaction.request.body = JSON.stringify({ name: generateRandomString(10) });
    }
  }

  done();
});
