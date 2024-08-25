const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
    id:String,
    created_at: Date,
    total_price_set:{
        shop_money:{
            amount: String,
            currency_code: String
        },
    },
    customer:{
        id:String,
    }
},{ collection: 'shopifyOrders' });

module.exports = mongoose.model("Order",OrderSchema);