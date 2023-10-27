const express = require("express");
const custumerRoute = require('./customerRoute');
const subcategorieRoute = require('./subcategorieRoute');
const app = express();

app.use("/", custumerRoute);
app.use("/", subcategorieRoute);



module.exports = app