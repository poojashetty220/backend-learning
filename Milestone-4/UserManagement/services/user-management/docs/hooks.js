const hooks = require('hooks');
const fs = require('fs');

const VALID_USER_ID = '6884da289d564917a54fe54f';
const INVALID_USER_ID = 'ffffffffffffffffffffffff';

function log(message) {
  fs.appendFileSync('hooks.log', `${new Date().toISOString()} ${message}\n`);
}

hooks.beforeEach((transaction, done) => {
  // Skip DELETE requests
  if (transaction.request.method === 'DELETE') {
    transaction.skip = true;
    log(`Skipping ${transaction.name} → DELETE request`);
    return done();
  }

  // Swap ID for 404 tests
  if (transaction.expected.statusCode === '404') {
    transaction.request.uri = transaction.request.uri.replace(VALID_USER_ID, INVALID_USER_ID);
    log(`Replaced ID for 404 test: ${transaction.request.uri}`);
  }

  // Add body for PUT /users/{id} (200 tests)
  if (
    transaction.request.uri.match(/\/users\/[^\/]+$/) &&
    transaction.request.method === 'PUT' &&
    transaction.expected.statusCode === '200'
  ) {
    transaction.request.body = JSON.stringify({
      name: 'Updated User',
      email: 'updated@example.com',
      age: '25',
      gender: 'Female'
    });
    log(`Added PUT body for ${transaction.name}`);
  }

  done();
});

hooks.afterEach((transaction, done) => {
  // Skip simulated 500 tests
  if (transaction.expected.statusCode === '500') {
    transaction.skip = true;
    log(`Skipping ${transaction.name} → Expected 500`);
  }
  done();
});
