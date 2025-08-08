require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../entities/Categories');
const mongoConnection = require('../lib/mongo-connection');
const { authenticate } = require('../middleware/auth');

let connection;

module.exports.handler = async (eventData) => {
    try {
        // Authentication
        const authResult = authenticate(eventData);
        if (authResult.error) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: authResult.error }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }
        
        connection = await mongoConnection.connect();

        // Query parameters
        const { search = '', limit = '10', offset = '0' } = eventData.queryStringParameters || {};
        const limitNum = Math.min(parseInt(limit) || 10, 100);
        const offsetNum = parseInt(offset) || 0;

        // Build filter
        const filter = {};
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        const categories = await Category.find(filter)
            .sort({ name: 1 })
            .limit(limitNum)
            .skip(offsetNum);

        return {
            statusCode: 200,
            body: JSON.stringify(categories),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (error) {
        console.error('Error in list handler:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                message: error.message,
                stack: error.stack
            }),
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