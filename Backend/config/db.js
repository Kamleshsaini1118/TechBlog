const mongoose = require("mongoose");

function connectDb(){
    mongoose.connect('mongodb+srv://UBER:EykZXYcueAPMGk2b@cluster1.b2ik1.mongodb.net/UBER')
    .then(() => {
        console.log('Connected to DB');
    }).catch(err => console.error("MongoDB connection error:", err));
}

module.exports = connectDb;