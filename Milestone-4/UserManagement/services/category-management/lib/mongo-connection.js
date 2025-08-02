/* eslint-disable no-undef */
const mongoose = require('mongoose')

module.exports.connect = async () => {
    mongoose.set('strictQuery', false)
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {})
        return mongoose
    } catch (err) {
        console.log(process.env.MONGODB_CONNECTION_STRING)
        throw err
    }
}
