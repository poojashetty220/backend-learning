// app.js (as ES Module)
import express from 'express';
import orders from './routes/orders.js';

const router = express.Router();

// Add JSON body parser middleware here
router.use(express.json());

router.use('/', orders);

export default router;
