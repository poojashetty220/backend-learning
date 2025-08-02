const mongoose = require('mongoose');
const Category = require('../entities/Categories');
const mongoConnection = require('../lib/mongo-connection');
let connection;
module.exports.handler = async (eventData) => {
    console.log('MONGODB_CONNECTION_STRING:', process.env.MONGODB_CONNECTION_STRING);
    try {   
        // Establish MongoDB connection
        connection = await mongoConnection.connect();

        const categories = await Category.find().sort({ name: 1 });
        return {
            statusCode: 200,
            body: JSON.stringify(categories),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } finally {
        // Disconnect from the MongoDB database
        if (connection) {
            await mongoose.disconnect();
        }
    }
};
