import express from 'express';
import Order from '../../../entities/Order.js';

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    let orders = await Order.find().populate('user_id');
    orders = orders.map(order => {
      const orderObj = order.toObject();
      if (orderObj.user_id) {
        orderObj.user_info = orderObj.user_id;
        orderObj.user_id = orderObj.user_id._id.toString();
      } else {
        orderObj.user_info = null;
        orderObj.user_id = null;
      }
      return orderObj;
    });
    res.json(orders);
  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// Get orders by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    let orders = await Order.find({ user_id: userId }).populate('user_id');
    orders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.user_info = orderObj.user_id;
      orderObj.user_id = orderObj.user_id._id.toString();
      return orderObj;
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders for user', error });
  }
});

// Create new order
router.post('/', async (req, res) => {
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

export default router;
