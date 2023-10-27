const mongoose = require('mongoose');
//connnect to mongo
mongoose.connect(process.env.MONGOOSE, {userNewUrlParser:true})
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });