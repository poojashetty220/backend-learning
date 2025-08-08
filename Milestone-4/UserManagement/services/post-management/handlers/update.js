const mongoose = require('mongoose');
const Post = require('../entities/Posts');
const mongoConnection = require('../lib/mongo-connection');

let connection;

module.exports.handler = async (eventData) => {
    try {
        connection = await mongoConnection.connect();
        
        const { id } = eventData.pathParameters;
        
        if (!eventData.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Request body is required' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }

        const data = JSON.parse(eventData.body);
        
        const updatedPost = await Post.findByIdAndUpdate(id, data, { new: true });
        
        if (!updatedPost) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Post not found' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }
        
        const response = {
            _id: updatedPost._id.toString(),
            title: updatedPost.title,
            content: updatedPost.content,
            categories: updatedPost.categories,
            user_id: updatedPost.user_id.toString(),
            created_at: updatedPost.created_at
        };
        
        return {
            statusCode: 200,
            body: JSON.stringify(response),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
            },
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: error.message || 'Something went wrong' }),
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