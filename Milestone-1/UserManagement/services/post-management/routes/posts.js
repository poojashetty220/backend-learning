import express from 'express';
import Post from '../../../entities/Posts.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      search = '',
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    const filter = {};

    // Case-insensitive search
    if (search) {
      const regex = new RegExp(search.toString(), 'i');
      filter.$or = [
        { title: regex },
      ];
    }

    const sortField = ['title', 'created_at'].includes(sort_by)
      ? sort_by
      : 'created_at';
    const sortDirection = sort_order === 'asc' ? 1 : -1;

    // Use populate to get category details
    console.time('query');
    const posts = await Post.find(filter)
      .populate('categories', 'name')
      .populate('user_id')  // populate user data
      .sort({ [sortField]: sortDirection })
    //   .explain( {"verbose": true })
    // console.timeEnd('query');
    // console.log(posts)

    const totalCount = await Post.countDocuments(filter);

    // Map posts to add user_info key with populated user data and keep user_id as string
    const postsWithUserInfo = posts.map(post => {
      const postObj = post.toObject();
      postObj.user_info = postObj.user_id;
      // Keep user_id as string (ObjectId) if user_id exists
      postObj.user_id = postObj.user_id ? postObj.user_id._id.toString() : null;
      return postObj;
    });

    res.json({ posts: postsWithUserInfo, stats: { totalCount } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create post
router.post('/', async (req, res) => {
  try {
    const post = new Post(req.body);
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/category/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const posts = await Post.find({ categories: categoryId })
      .populate('categories', 'name')
      .populate('user_id')
      .exec();

    const postsWithUserInfo = posts.map(post => {
      const postObj = post.toObject();
      postObj.user_info = postObj.user_id;
      postObj.user_id = postObj.user_id ? postObj.user_id._id.toString() : null;
      return postObj;
    });

    res.json({ posts: postsWithUserInfo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

