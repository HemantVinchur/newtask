const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let userAuthSchema = new Schema({
    username: String,
    accessToken: String,
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('userAuthSchema', userAuthSchema)