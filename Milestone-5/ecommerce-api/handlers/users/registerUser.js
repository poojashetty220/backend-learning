const bcrypt = require('bcryptjs');
const connectToDatabase = require('../../db');
const User = require('../../entities/user');

exports.handler = async (event) => {
  try {
    const { name, email, password, shippingAddress } = JSON.parse(event.body);

    if (!name || !email || !password || !shippingAddress) {
      return { 
        statusCode: 400, 
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'All fields are required' }) 
      };
    }

    await connectToDatabase(process.env.MONGODB_URI);

    const existing = await User.findOne({ email });
    if (existing) {
      return { 
        statusCode: 409, 
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'User already exists' }) 
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, shippingAddress });

    return { 
      statusCode: 201, 
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(user) 
    };
  } catch (err) {
    return { 
      statusCode: 500, 
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: err.message }) 
    };
  }
};
