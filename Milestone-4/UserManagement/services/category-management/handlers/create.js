require('dotenv').config();
const Category = require('../entities/Categories.js');
const mongoConnection = require('../lib/mongo-connection');
const mongoose = require('mongoose');
const { authenticate } = require('../middleware/auth');

let connection

module.exports.handler = async (eventData) => {
    try {
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
        
        if (!data.name) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Name is required' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }
        
        const category = new Category(data);
        const savedCategory = await category.save();
        
        return {
            statusCode: 201,
            body: JSON.stringify(savedCategory),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: error.message }),
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
}