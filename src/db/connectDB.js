const mongoose = require('mongoose')
require('dotenv').config()

async function connectDb(){
    try {
        await mongoose.connect(process.env.url,{
            useNewUrlParser:true
        }) 
        console.log("database connected")
    } catch (error) {
        console.log(error.message)        
    }
} 


module.exports = {connectDb}