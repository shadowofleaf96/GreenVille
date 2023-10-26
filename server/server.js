
const mongoose = require('mongoose')
const Product = require('./models/products');
const Order = require('./models/orders')
const app = require('./app')
const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

