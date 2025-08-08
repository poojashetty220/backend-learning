const mongoose = require('mongoose');
const Post = require('../entities/Posts');
const mongoConnection = require('../lib/mongo-connection');

let connection;

module.exports.handler = async (eventData) => {
    try {
        connection = await mongoConnection.connect();
        
        const { categoryId } = eventData.pathParameters;
        
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

        return {
            statusCode: 200,
            body: JSON.stringify({ posts: postsWithUserInfo }),
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
            body: JSON.stringify({ message: 'Error fetching posts by category', error: error.message }),
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