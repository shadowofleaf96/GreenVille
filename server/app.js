const express = require('express');
require('dotenv').config();
const api = require('./routes/api');
const database = require('../server/config/database');
const app = express();
app.use(express.json())

app.use('/', api);




module.exports = app