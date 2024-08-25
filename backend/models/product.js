const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    id: String,
    title: String,
    price: String,
},{collection:"shopifyProducts"});
module.exports = mongoose.model('Product', ProductSchema);