const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  subcategory: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  keywords: [String] // For product search
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
