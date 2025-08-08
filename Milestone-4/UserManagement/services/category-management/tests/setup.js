const mongoose = require('mongoose');

// Setup for test environment
process.env.NODE_ENV = 'test';

// Mock console.error to avoid noise in test output
const originalConsoleError = console.error;
console.error = jest.fn();

// Restore console.error after tests
afterAll(() => {
  console.error = originalConsoleError;
});

// Close database connection after all tests
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});