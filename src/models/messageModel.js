const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const messageSchema = mongoose.Schema({
    sender:{
        type:objectId,
        ref:'user'
    },
    content:{
        type:String,
        required:true
    },
    roomId:{
        type:objectId,
        ref:'Room'
    }
},{timestamps:true})

module.exports = mongoose.model('message',messageSchema)