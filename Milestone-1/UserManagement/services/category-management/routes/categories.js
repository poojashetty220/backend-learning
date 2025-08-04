import express from 'express';
import Category from '../../../entities/Categories.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const categories = await Category.find()
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);
    
    const totalCount = await Category.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);
    
    res.json({
      categories,
      stats: {
        totalCount,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
