const express = require('express');

const router = express.Router();

// Import the User model
const users = require('./routes/users.js');

// Define routes
router.use('/users', users);
