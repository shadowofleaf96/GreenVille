const express = require('express');
const productRouter = require('../routes/productRoute')
const ordersRouter = require('../routes/ordersRoute');
const app = express();
app.use('/', productRouter)
app.use('/', ordersRouter);




module.exports = app