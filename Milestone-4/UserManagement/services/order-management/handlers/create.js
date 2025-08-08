const mongoose = require('mongoose');
const Order = require('../entities/Order');
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
        const { order_number, total_amount, user_id, user_name } = data;

        // Validate required fields
        if (!order_number || !total_amount || !user_id || !user_name) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields: order_number, total_amount, user_id, user_name' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }

        const newOrder = new Order({ 
            order_number, 
            total_amount, 
            user_id, 
            user_name 
        });
        
        const savedOrder = await newOrder.save();
        
        // Ensure all required fields are present in response
        const response = {
            _id: savedOrder._id.toString(),
            order_number: savedOrder.order_number,
            total_amount: savedOrder.total_amount.toString(),
            user_id: savedOrder.user_id.toString(),
            user_name: savedOrder.user_name,
            createdAt: savedOrder.createdAt,
            updatedAt: savedOrder.updatedAt
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
