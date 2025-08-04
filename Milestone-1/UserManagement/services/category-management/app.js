// app.js (as ES Module)
import express from 'express';
import categories from './routes/categories.js';

const router = express.Router();

router.use('/', categories);

export default router;
