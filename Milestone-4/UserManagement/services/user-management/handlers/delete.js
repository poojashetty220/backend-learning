const mongoose = require('mongoose');
const User = require('../entities/User');
const mongoConnection = require('../lib/mongo-connection');

let connection;

module.exports.handler = async (eventData) => {
    try {
        connection = await mongoConnection.connect();
        
        const { id } = eventData.pathParameters;
        
        const user = await User.findByIdAndDelete(id);
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
            body: JSON.stringify({ message: 'User deleted successfully' }),
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
            body: JSON.stringify({ message: 'Error deleting user', error: error.message }),
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