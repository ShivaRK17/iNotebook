const mongoose = require('mongoose')
require('dotenv').config()
const mongoURI =  process.env.MONGODB_URL
console.log(mongoURI);

const connectToMongo = ()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to mongoose successfully");
    })
}

module.exports = connectToMongo