import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user_name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

postSchema.plugin(mongoosePaginate);

const Post = mongoose.model('Post', postSchema);

export default Post;
