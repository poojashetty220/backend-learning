import express from 'express';
import User from '../../../entities/User.js';
import Post from '../../../entities/Posts.js';
import mongoose from 'mongoose';
import { exec } from 'child_process';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('JWT verification error:', err);
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Access token expired' });
      }
      return res.status(403).json({ message: 'Invalid access token' });
    }
    req.user = user;
    next();
  });
};

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

    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

  
// New route to get users with multiple addresses
router.get('/multiple-addresses', async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $match: {
          $expr: { $gt: [{ $size: '$addresses' }, 1] }
        }
      }
    ]);
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

    const result = await User.aggregate(pipeline);

    const users = result[0].users;
    const stats = result[0].stats[0] || { averageAge: 0, totalCount: 0 };

    res.json({ users, stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// New route to get posts with user info joined
router.get('/posts-with-users', async (req, res, next) => {
  try {
    const postsWithUsers = await Post.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user_info'
        }
      },
      {
        $unwind: '$user_info'
      },
      {
        $sort: { created_at: -1 }
      }
    ]);
    res.json({ posts: postsWithUsers });
  } catch (error) {
    next(error);
  }
});

// Create user
router.post('/', async (req, res) => {
  try {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = { ...req.body, password: hashedPassword };
    const user = new User(userData);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      // Duplicate email error
      return res.status(409).json({ message: 'Email already exists' });
    }
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

// New route for backup, drop, and restore
router.post('/backup-restore', async (req, res) => {
  try {
    const dbName = mongoose.connection.name;
    const dumpPath = path.resolve(__dirname, '../../../backup');

    console.log('Starting backup for DB:', dbName);

    // Step 1: Backup the database using mongodump with timeout
    await new Promise((resolve, reject) => {
      const backupProcess = exec(`mongodump --db=${dbName} --out=${dumpPath}`, { timeout: 60000 }, (error, stdout, stderr) => {
        if (error) {
          console.error('Backup failed:', stderr);
          reject(new Error(`Backup failed: ${stderr}`));
        } else {
          console.log('Backup stdout:', stdout);
          resolve(stdout);
        }
      });
      backupProcess.on('error', (err) => {
        console.error('Backup process error:', err);
        reject(err);
      });
    });

    console.log('Backup completed. Dropping database:', dbName);

    // Step 2: Drop the database
    await mongoose.connection.dropDatabase();

    console.log('Database dropped. Starting restore from:', `${dumpPath}/${dbName}`);

    // Step 3: Restore the database using mongorestore with timeout
    await new Promise((resolve, reject) => {
      const restoreProcess = exec(`mongorestore --db=${dbName} ${dumpPath}/${dbName}`, { timeout: 60000 }, (error, stdout, stderr) => {
        if (error) {
          console.error('Restore failed:', stderr);
          reject(new Error(`Restore failed: ${stderr}`));
        } else {
          console.log('Restore stdout:', stdout);
          resolve(stdout);
        }
      });
      restoreProcess.on('error', (err) => {
        console.error('Restore process error:', err);
        reject(err);
      });
    });

    console.log('Restore completed successfully.');

    res.json({ message: 'Backup, drop, and restore completed successfully' });
  } catch (error) {
    console.error('Backup-Restore error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message || 'Unknown error' });
    }
  }
});

export default router;

