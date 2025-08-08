const mongoose = require('mongoose');
const Post = require('../entities/Posts');
const mongoConnection = require('../lib/mongo-connection');

let connection;

module.exports.handler = async (eventData) => {
    try {
        connection = await mongoConnection.connect();
        
        const { search = '', sort_by = 'created_at', sort_order = 'desc' } = eventData.queryStringParameters || {};
        
        const filter = {};
        if (search) {
            const regex = new RegExp(search.toString(), 'i');
            filter.$or = [{ title: regex }];
        }

        const sortField = ['title', 'created_at'].includes(sort_by) ? sort_by : 'created_at';
        const sortDirection = sort_order === 'asc' ? 1 : -1;

        const posts = await Post.find(filter)
            .populate('categories', 'name')
            .populate('user_id')
            .sort({ [sortField]: sortDirection });

        const totalCount = await Post.countDocuments(filter);

        const postsWithUserInfo = posts.map(post => {
            const postObj = post.toObject();
            postObj.user_info = postObj.user_id;
            postObj.user_id = postObj.user_id ? postObj.user_id._id.toString() : null;
            return postObj;
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ posts: postsWithUserInfo, stats: { totalCount } }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching posts', error: error.message }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };
    } finally {
        if (connection) {
            await mongoose.disconnect();
        }
    }
};