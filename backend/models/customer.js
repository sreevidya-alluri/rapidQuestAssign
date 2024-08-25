const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    id:String,
    created_at: Date,
    default_address :{
        city: String,
    }
},{collection:"shopifyCustomers"});
module.exports = mongoose.model("Customer", customerSchema);