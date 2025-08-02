// app.js (as ES Module)
import express from 'express';
import posts from './routes/posts.js';

const router = express.Router();

router.use('/', posts);

export default router;
