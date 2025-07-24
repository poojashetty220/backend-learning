import express from 'express';
import User from '../../../entities/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { min_age, search = '', sort_by = 'created_at', sort_order = 'desc' } = req.query;

    const filter = {};

    // Filter by min age
    if (min_age) {
      filter.age = { $gte: Number(min_age) };
    }

    // Case-insensitive search by name/email/gender
    if (search) {
      const regex = new RegExp(search.toString(), 'i');
      filter.$or = [
        { name: regex },
        { email: regex },
        { gender: regex }
      ];
    }

    // Sort logic
    const sortField = sort_by === 'name' ? 'name' : 'created_at';
    const sortDirection = sort_order === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortDirection };

    const users = await User.find(filter).sort(sort);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Create user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

