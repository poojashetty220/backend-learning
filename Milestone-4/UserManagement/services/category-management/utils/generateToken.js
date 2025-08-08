require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-here';

// Generate a test token
const payload = {
    userId: '64a8f9b3d5e2a7c9b8f4a2d1',
    email: 'test@example.com',
    name: 'Test User'
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

console.log('Generated JWT Token:');
console.log(token);
console.log('\nUse this token in Authorization header as:');
console.log(`Bearer ${token}`);