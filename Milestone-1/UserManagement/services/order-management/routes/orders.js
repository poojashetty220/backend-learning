import express from 'express';
import Order from '../../../entities/Order.js';

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    let orders = await Order.find().populate('user_id');
    // Add user_info key with full user data, keep user_id and user_name unchanged
    orders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.user_info = orderObj.user_id;
      orderObj.user_id = orderObj.user_id._id.toString();
      return orderObj;
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user_id', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
});

// Create new order
router.post('/', async (req, res) => {
  console.log('Request body:', req.body);
  try {
    const { order_number, total_amount, user_id, user_name } = req.body;
    const newOrder = new Order({ order_number, total_amount, user_id, user_name });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
});

// Update order
router.put('/:id', async (req, res) => {
  try {
    const { order_number, total_amount, user_id, user_name } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { order_number, total_amount, user_id, user_name },
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
});

export default router;
