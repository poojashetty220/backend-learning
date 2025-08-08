const mongoose = require('mongoose');
require('dotenv').config();

const Post = require('./entities/Posts');
const Category = require('./entities/Category');
const User = require('./entities/User');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    
    // Create test category
    const category = await Category.findOneAndUpdate(
      { _id: '64a8f9b3d5e2a7c9b8f4a2d1' },
      { name: 'Technology' },
      { upsert: true, new: true }
    );
    
    // Create test user
    const user = await User.findOneAndUpdate(
      { _id: '64a8f9b3d5e2a7c9b8f4a2d1' },
      { name: 'John Doe', email: 'john@example.com' },
      { upsert: true, new: true }
    );
    
    // Create test post
    await Post.findOneAndUpdate(
      { _id: '6887582d2b93f60018550791' },
      {
        title: 'My First Blog Post',
        content: 'This is the content of the post.',
        categories: [category._id],
        user_id: user._id
      },
      { upsert: true, new: true }
    );
    
    console.log('Test data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();