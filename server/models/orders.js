const express = require('express')
const mongoose = require('mongoose')
const ordersSchema = mongoose.Schema({
    customer_id: {
        type: String,
    },
    order_items: [Array],
    order_date: {
        type: Number,
        default: Date.now
    },
    cart_total_price: {
        type: Number,
    },
    status: {
        type: String,
        default: 'open',
    },

},
    {
        collection: "Orders"
    })



const Order = mongoose.model('Order', ordersSchema);

module.exports = Order;