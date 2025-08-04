import express from 'express';
import Post from '../../../entities/Posts.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      search = '',
      sort_by = 'created_at',
      sort_order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

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

    const posts = await Post.find(filter)
      .populate('categories', 'name')
      .populate('user_id')
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limitNum);

    const totalCount = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limitNum);

    const postsWithUserInfo = posts.map(post => {
      const postObj = post.toObject();
      postObj.user_info = postObj.user_id;
      postObj.user_id = postObj.user_id ? postObj.user_id._id.toString() : null;
      return postObj;
    });

    res.json({ 
      posts: postsWithUserInfo, 
      stats: { 
        totalCount,
        currentPage: pageNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
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

router.patch('/:id', async (req, res) => {
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

