import mongoose from 'mongoose';

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOST = 'localhost',
  MONGO_PORT = '27017',
  MONGO_DB = 'userManagement'
} = process.env;

const authPart = MONGO_USERNAME && MONGO_PASSWORD ? `${MONGO_USERNAME}:${MONGO_PASSWORD}@` : '';

const connectionString = `mongodb://${authPart}${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

export const connect = () => {
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
