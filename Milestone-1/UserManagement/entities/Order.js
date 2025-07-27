import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
   order_number: { type: String, required: true, unique: true },
  total_amount: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user_name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;

