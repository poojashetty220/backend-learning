const connectToDatabase = require('../../db');
const Cart = require('../../entities/cart');

exports.handler = async (event) => {
  try {
    const { userId, productId } = JSON.parse(event.body);

    if (!userId || !productId) {
      return { statusCode: 400, body: JSON.stringify({ message: 'userId and productId are required' }) };
    }

    await connectToDatabase(process.env.MONGODB_URI);

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [{ productId, quantity: 1 }] });
    } else {
      const existingItem = cart.items.find(i => i.productId.toString() === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
      await cart.save();
    }

    return { statusCode: 200, body: JSON.stringify(cart) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};
