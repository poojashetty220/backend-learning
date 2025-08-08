const mongoose = require('mongoose');
const User = require('../entities/User');
const mongoConnection = require('../lib/mongo-connection');

let connection;

module.exports.handler = async (eventData) => {
    try {
        connection = await mongoConnection.connect();
        
        const { id } = eventData.pathParameters;
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }
        
        const user = await User.findById(id, { addresses: 1 });
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
            body: JSON.stringify({ addresses: user.addresses || [] }),
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
            body: JSON.stringify({ message: 'Error fetching user addresses', error: error.message }),
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