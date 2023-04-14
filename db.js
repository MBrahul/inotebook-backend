require('dotenv').config({path:'.env'});
const D_PASSWORD = process.env.D_PASSWORD

const mongoose = require('mongoose');

const mongoURL =`mongodb+srv://inotebook:${D_PASSWORD}@cluster0.xteaiks.mongodb.net/inotebook?retryWrites=true&w=majority`;


const connectToMongo=()=>{
    mongoose.connect(mongoURL,()=>{
        console.log('connected to Mongo successfully');
    })
};

module.exports = connectToMongo;