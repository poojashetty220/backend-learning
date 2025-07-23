import express from 'express';
import { connect } from './lib/connect.js';
import routes from './services/user-management/app.js';

// For CORS support
const cors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
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

app.use('/api', routes)

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});