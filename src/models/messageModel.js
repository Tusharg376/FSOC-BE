const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const messageSchema = mongoose.Schema({
    sender:{
        type:objectId,
        ref:'user'
    },
    content:{
        type:String
    },
    room:{
        type:objectId,
        ref:'room'
    }
},{timeStamps:true})

module.exports = mongoose.model('room',messageSchema)