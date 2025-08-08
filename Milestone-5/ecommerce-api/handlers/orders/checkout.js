const connectToDatabase = require('../../db');
const Cart = require('../../entities/cart');
const Order = require('../../entities/order');

exports.handler = async (event) => {
  try {
    const { userId, shippingAddress, paymentMethod } = JSON.parse(event.body);

    if (!userId || !shippingAddress || !paymentMethod) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields' }) };
    }

    await connectToDatabase(process.env.MONGODB_URI);

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Cart is empty' }) };
    }

    const order = await Order.create({
      userId,
      shippingAddress,
      paymentMethod,
      items: cart.items,
      status: 'Pending'
    });

    cart.items = [];
    await cart.save();

    return { statusCode: 201, body: JSON.stringify(order) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};
