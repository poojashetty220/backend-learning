const connectToDatabase = require('../../db');
const Order = require('../../entities/order');

exports.handler = async (event) => {
  try {
    const { userId } = event.queryStringParameters || {};
    if (!userId) {
      return { statusCode: 400, body: JSON.stringify({ message: 'userId is required' }) };
    }

    await connectToDatabase(process.env.MONGODB_URI);

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return { statusCode: 200, body: JSON.stringify(orders) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};
