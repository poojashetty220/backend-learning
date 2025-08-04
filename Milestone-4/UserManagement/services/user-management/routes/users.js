import express from 'express';
import User from '../../../entities/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const payload = { id: user._id, email: user.email };
    // Add expiration time of 1 hour to the token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, email: user.email, name: user.name, pageAccess: user.pageAccess } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

  
/**
 * New route to get users with multiple addresses
 */
router.get('/multiple-addresses', async (req, res) => {
  try {
    // Find users where addresses is an array with length > 1
    const users = await User.find({
      addresses: { $exists: true, $type: 'array' },
      $expr: { $gt: [{ $size: '$addresses' }, 1] }
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const {
      min_age,
      city = '',
      search = '',
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    const filter = {};

    // Filter by minimum age (age is stored as string, so we need to cast)
    if (min_age) {
      filter.$expr = {
        $gte: [
          {
            $convert: {
              input: '$age',
              to: 'int',
              onError: null,
              onNull: null
            }
          },
          Number(min_age)
        ]
      };
    }

    // Filter by city (case-insensitive)
    if (city) {
      filter['addresses.city'] = { $regex: new RegExp(city.toString(), 'i') };
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
                      {
                        $convert: {
                          input: '$age',
                          to: 'int',
                          onError: null,
                          onNull: null
                        }
                      },
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

    const result = await User.aggregate(pipeline)
    console.log(result)

    const users = result[0].users;
    const stats = result[0].stats[0] || { averageAge: 0, totalCount: 0 };

    res.json({ users, stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// route to get only addresses of a user by id
router.get('/:id/addresses', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { addresses: 1 });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ addresses: user.addresses || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    // Ensure addresses field is handled properly
    if (updateData.addresses && !Array.isArray(updateData.addresses)) {
      return res.status(400).json({ message: 'Addresses must be an array' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

