import mongoose from 'mongoose';

export const connect = () => {

  mongoose.connect('mongodb://localhost:27017/userManagement', {
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
