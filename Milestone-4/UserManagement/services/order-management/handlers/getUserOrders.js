const mongoose = require('mongoose');
const Order = require('../entities/Order');
const mongoConnection = require('../lib/mongo-connection');

let connection;

module.exports.handler = async (eventData) => {
    try {
        connection = await mongoConnection.connect();
        
        const userId = eventData.pathParameters.userId;
        let orders = await Order.find({ user_id: userId }).populate('user_id');
        orders = orders.map(order => {
            const orderObj = order.toObject();
            orderObj.user_info = orderObj.user_id;
            orderObj.user_id = orderObj.user_id._id.toString();
            return orderObj;
        });
        
        return {
            statusCode: 200,
            body: JSON.stringify(orders),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching orders for user', error: error.message }),
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