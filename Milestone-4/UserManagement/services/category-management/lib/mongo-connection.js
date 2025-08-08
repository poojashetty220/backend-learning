const mongoose = require('mongoose');

let connection = null;

module.exports.connect = async () => {
    if (connection && mongoose.connection.readyState === 1) {
        return connection;
    }
    
    try {
        connection = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        return connection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};
