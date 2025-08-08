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

    const filter = {};

    // Case-insensitive search
    if (search) {
      let decodedSearch;
      try {
        decodedSearch = decodeURIComponent(search);
      } catch (e) {
        decodedSearch = search;
      }
      const escapedSearch = decodedSearch.replace(/[.*+?^${}&$#'=(\-)|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedSearch, 'i');
      filter.$or = [
        { title: regex },
      ];
    }

    const sortField = ['title', 'created_at'].includes(sort_by)
      ? sort_by
      : 'created_at';
    const sortDirection = sort_order === 'asc' ? 1 : -1;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortField]: sortDirection },
      populate: [
        { path: 'categories', select: 'name' },
        { path: 'user_id' }
      ]
    };

    const result = await Post.paginate(filter, options);

    const postsWithUserInfo = result.docs.map(post => {
      const postObj = post.toObject();
      postObj.user_info = postObj.user_id;
      postObj.user_id = postObj.user_id ? postObj.user_id._id.toString() : null;
      return postObj;
    });

    res.status(200).json({
      posts: postsWithUserInfo, 
      stats: { 
        totalCount: result.totalDocs,
        currentPage: result.page,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create post
router.post('/', async (req, res) => {
  if (!req.body || !req.body.title || !req.body.content || !req.body.user_id) {
    return res.status(400).json({ message: 'Title, content, and user ID are required' });
  }
  try {
    const post = new Post(req.body);
    const savedPost = await post.save();
    res.status(201).json({ ...savedPost.toObject() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'Request body is required' });
  }
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ ...post.toObject() });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    res.status(200).json({ posts: postsWithUserInfo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

