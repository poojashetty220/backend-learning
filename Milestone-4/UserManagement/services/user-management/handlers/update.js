const mongoose = require('mongoose');
const User = require('../entities/User');
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

        const updateData = JSON.parse(eventData.body);
        
        // Validate required fields are not empty
        if ((updateData.name !== undefined && updateData.name === '') ||
            (updateData.email !== undefined && updateData.email === '') ||
            (updateData.age !== undefined && updateData.age === '') ||
            (updateData.gender !== undefined && updateData.gender === '')) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Required fields cannot be empty' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }
        
        if (updateData.addresses && !Array.isArray(updateData.addresses)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Addresses must be an array' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }

        const user = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!user) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(user),
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