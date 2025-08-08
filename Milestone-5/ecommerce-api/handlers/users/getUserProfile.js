const connectToDatabase = require('../../db');
const User = require('../../entities/user');

exports.handler = async (event) => {
  try {
    const { userId } = event.queryStringParameters || {};
    if (!userId) {
      return { statusCode: 400, body: JSON.stringify({ message: 'userId is required' }) };
    }

    await connectToDatabase(process.env.MONGODB_URI);

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
    }

    return { statusCode: 200, body: JSON.stringify(user) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};
