const connectToDatabase = require('../../db');
const Order = require('../../entities/order');

exports.handler = async (event) => {
  try {
    const { orderId } = event.pathParameters;
    await connectToDatabase(process.env.MONGODB_URI);

    const order = await Order.findById(orderId);
    if (!order) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Order not found' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ status: order.status }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};
