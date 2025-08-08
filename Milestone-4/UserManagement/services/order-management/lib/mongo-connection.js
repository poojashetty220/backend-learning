const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_CONNECTION_STRING;

const connect = () => {
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
}

module.exports = { connect };
