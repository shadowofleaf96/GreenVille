const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://arkxdb:zPTHau3xZEl6BYVn@cluster0.8mhtk2j.mongodb.net/arkxdb", { useNewUrlParser: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to Database:", error);
    });
