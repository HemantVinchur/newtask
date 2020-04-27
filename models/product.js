const mongoose = require('mongoose')
const Schema = mongoose.Schema

let productSchema = new Schema({
    productName: String,
    price: String,
    image: String
})

module.exports = mongoose.model('productSchema', productSchema)