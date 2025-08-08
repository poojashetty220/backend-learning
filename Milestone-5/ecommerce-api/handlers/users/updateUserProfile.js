const connectToDatabase = require('../../db');
const User = require('../../entities/user');

exports.handler = async (event) => {
  try {
    const { userId, name, email, shippingAddress } = JSON.parse(event.body);

    if (!userId) {
      return { statusCode: 400, body: JSON.stringify({ message: 'userId is required' }) };
    }

    await connectToDatabase(process.env.MONGODB_URI);

    const updated = await User.findByIdAndUpdate(
      userId,
      { name, email, shippingAddress },
      { new: true }
    ).select('-password');

    if (!updated) {
      return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
    }

    return { statusCode: 200, body: JSON.stringify(updated) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};
