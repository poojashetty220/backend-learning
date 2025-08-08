const mongoose = require('mongoose');
const Order = require('../entities/Order');
const mongoConnection = require('../lib/mongo-connection');

let connection;

module.exports.handler = async (eventData) => {
    try {
        connection = await mongoConnection.connect();
        
        const data = JSON.parse(eventData.body);
        const { order_number, total_amount, user_id, user_name } = data;
        const updatedOrder = await Order.findByIdAndUpdate(
            eventData.pathParameters.id,
            { order_number, total_amount, user_id, user_name },
            { new: true }
        );
        
        if (!updatedOrder) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Order not found' }),
                headers: {
                    'Content-Type': 'application/json',
                },
            };
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify(updatedOrder),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error updating order', error: error.message }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } finally {
        if (connection) {
            await mongoose.disconnect();
        }
    }
};