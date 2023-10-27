const custumerRoute = require('./customerRoute');
const subcategorieRoute = require('./subcategorieRoute');
const express = require('express')

const app = express()

app.use('/customer',custumerRoute)
app.use('/subcategories',subcategorieRoute)

module.exports = app