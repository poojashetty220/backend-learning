import express from 'express';
import { connect } from './lib/connect.js';
import routes from './services/user-management/app.js';
import postRoutes from './services/post-management/app.js';
import categoryManagementRoutes from './services/category-management/app.js';
import orderManagementRoutes from './services/order-management/app.js';

// For CORS support
const cors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
};

const app = express();
const PORT = 3001;

// Middleware to parse JSON
app.use(express.json());

// Enable CORS
app.use(cors);

connect();

// Example route
app.get('/', (req, res) => {
  res.send('Hello from Node.js server with MongoDB!');
});


app.use('/api', routes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryManagementRoutes);
app.use('/api/orders', orderManagementRoutes);


// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (!res.headersSent) {
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
