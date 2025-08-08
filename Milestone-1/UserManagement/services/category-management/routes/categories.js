import express from 'express';
import Category from '../../../entities/Categories.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const options = {
      page,
      limit,
      sort: { name: 1 }
    };

    const result = await Category.paginate({}, options);
    
    return res.status(200).json({
      categories: result.docs,
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

// Create a new category
router.post('/', async (req, res) => {
  if (!req.body || !req.body.name) {
    return res.status(400).json({ message: 'Name is required' });
  }
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    res.status(201).json({ ...savedCategory.toObject() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update category
router.patch('/:id', async (req, res) => {
  try {
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ ...category.toObject() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
