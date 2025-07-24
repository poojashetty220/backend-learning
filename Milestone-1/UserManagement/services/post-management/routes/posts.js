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

    const pipeline = [
      { $match: filter },
      {
        $facet: {
          posts: [
            { $sort: { [sortField]: sortDirection } }
          ],
          stats: [
            {
              $group: {
                _id: null,
                totalCount: { $sum: 1 }
              }
            }
          ]
        }
      }
    ];

    const result = await Post.aggregate(pipeline);

    const posts = result[0].posts;
    const stats = result[0].stats[0] || { totalCount: 0 };

    res.json({ posts, stats });
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

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
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

export default router;

