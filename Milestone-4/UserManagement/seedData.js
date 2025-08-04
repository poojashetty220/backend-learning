import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './entities/User.js';

async function seed() {
  try {
    await mongoose.connect('mongodb://localhost:27017/userManagement', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingUser = await User.findOne({ email: 'testuser@example.com' });
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('TestPassword123', 10);

    const user = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: hashedPassword,
      age: '30',
      gender: 'Other',
      phone: '1234567890',
      created_at: new Date(),
    });

    await user.save();
    console.log('Test user created successfully');
  } catch (error) {
    console.error('Error seeding test user:', error);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
