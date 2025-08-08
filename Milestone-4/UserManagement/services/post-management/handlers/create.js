const mongoose = require('mongoose');
const Post = require('../entities/Posts');
const mongoConnection = require('../lib/mongo-connection');

let connection;

module.exports.handler = async (eventData) => {
    try {
        connection = await mongoConnection.connect();
        
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
        const { title, content, categories, user_id } = data;

        if (!title || !content || !categories || !user_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields: title, content, categories, user_id' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }

        const newPost = new Post({ title, content, categories, user_id });
        const savedPost = await newPost.save();
        
        const response = {
            _id: savedPost._id.toString(),
            title: savedPost.title,
            content: savedPost.content,
            categories: savedPost.categories,
            user_id: savedPost.user_id.toString(),
            created_at: savedPost.created_at
        };
        
        return {
            statusCode: 201,
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