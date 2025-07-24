import express from 'express';
import User from '../../../entities/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      min_age,
      search = '',
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    const filter = {};

    // Filter by minimum age (age is stored as string, so we need to cast)
    if (min_age) {
      filter.$expr = {
        $gte: [{ $toInt: '$age' }, Number(min_age)]
      };
    }

    // Case-insensitive search
    if (search) {
      const regex = new RegExp(search.toString(), 'i');
      filter.$or = [
        { name: regex },
        { email: regex },
        { gender: regex }
      ];
    }

    const sortField = ['name', 'email', 'created_at'].includes(sort_by)
      ? sort_by
      : 'created_at';
    const sortDirection = sort_order === 'asc' ? 1 : -1;

    const pipeline = [
      { $match: filter },
      {
        $facet: {
          users: [
            { $sort: { [sortField]: sortDirection } }
          ],
          stats: [
            {
              $group: {
                _id: null,
                averageAge: {
                  $avg: {
                    $cond: [
                      { $ne: ['$age', null] },
                      { $toInt: '$age' },
                      null
                    ]
                  }
                },
                totalCount: { $sum: 1 }
              }
            }
          ]
        }
      }
    ];

    const result = await User.aggregate(pipeline);

    const users = result[0].users;
    const stats = result[0].stats[0] || { averageAge: 0, totalCount: 0 };

    res.json({ users, stats });
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

