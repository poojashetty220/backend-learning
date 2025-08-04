const Category = require('../entities/Categories.js');
const mongoConnection = require('../lib/mongo-connection')
const mongoose = require('mongoose')

let connection

module.exports.handler = async (eventData) => {
    try {
        // Establish MongoDB connection
        connection = await mongoConnection.connect()

        const data = JSON.parse(eventData.body);
        const category = new Category(data);
        const savedCategory = await category.save();
        return {
        statusCode: 201,
        body: JSON.stringify(savedCategory),
        headers: {
            'Content-Type': 'application/json',
        },
        };
    } catch (error) {
        return {
        statusCode: 400,
        body: JSON.stringify({ message: error.message }),
        headers: {
            'Content-Type': 'application/json',
        },
        };
    } finally {
        // Disconnect from the MongoDB database
        if (connection) {
            await mongoose.disconnect()
        }
    }
}
