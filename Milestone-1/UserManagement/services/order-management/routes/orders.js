import express from 'express';
import Order from '../../../entities/Order.js';

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const options = {
      page,
      limit,
      populate: 'user_id'
    };

    const result = await Order.paginate({}, options);
    
    const orders = result.docs.map(order => {
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
    
    res.status(200).json({
      orders,
      stats: {
        totalCount: result.totalDocs,
        currentPage: result.page,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage
      }
    });
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
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders for user', error });
  }
});

// Create new order
router.post('/', async (req, res) => {
  if (!req.body || !req.body.order_number || !req.body.total_amount || !req.body.user_id) {
    return res.status(400).json({ message: 'Order number, total amount, and user ID are required' });
  }
  try {
    const { order_number, total_amount, user_id, user_name } = req.body;
    const newOrder = new Order({ order_number, total_amount, user_id, user_name });
    const savedOrder = await newOrder.save();
    res.status(201).json({ ...savedOrder.toObject() });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
});

// Update order
router.patch('/:id', async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'Request body is required' });
  }
  try {
    const { order_number, total_amount, user_id, user_name } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { order_number, total_amount, user_id, user_name },
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ ...updatedOrder.toObject() });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
});

export default router;
