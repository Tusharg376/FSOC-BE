const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    phone:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profile:{
        type:String,
        required:true
    },
    rooms:{
        type:[objectId]
    }
},{timestamps:true})

module.exports = mongoose.model('user',userSchema)