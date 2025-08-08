const connectToDatabase = require('../../db');
const Cart = require('../../entities/cart');

exports.handler = async (event) => {
  try {
    const { userId, productId } = JSON.parse(event.body);

    if (!userId || !productId) {
      return { statusCode: 400, body: JSON.stringify({ message: 'userId and productId are required' }) };
    }

    await connectToDatabase(process.env.MONGODB_URI);

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Cart not found' }) };
    }

    cart.items = cart.items.filter(i => i.productId.toString() !== productId);
    await cart.save();

    return { statusCode: 200, body: JSON.stringify(cart) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};
