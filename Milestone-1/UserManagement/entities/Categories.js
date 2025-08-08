import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
});

categorySchema.plugin(mongoosePaginate);

const Category = mongoose.model('Category', categorySchema);

export default Category;
