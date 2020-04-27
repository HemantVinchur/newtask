const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    contact: Number,
    password: String,
    salt: String,
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('userSchema', userSchema)