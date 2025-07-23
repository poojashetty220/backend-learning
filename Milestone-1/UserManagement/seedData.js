import mongoose from 'mongoose';
import User from './models/User.js';

// MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/userManagement';

// Sample user data
const users = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    role: 'admin',
    status: 'active',
    department: 'Engineering',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    role: 'manager',
    status: 'active',
    department: 'Product'
  },
  {
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    phone: '555-555-5555',
    role: 'user',
    status: 'inactive',
    department: 'Marketing'
  }
];

// Connect to MongoDB and seed data
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');
    
    // Insert new users
    const result = await User.insertMany(users);
    console.log(`✅ Added ${result.length} users to the database`);
    
    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});