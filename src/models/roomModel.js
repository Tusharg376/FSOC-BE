const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const roomSchema = mongoose.Schema({
    roomName:{
        type: String,
        required: true
    },
    users:{
        type: [objectId],
        ref: 'user'
    },
    roomAdmin:{
        type: objectId,
        ref: 'user'
    },
    isPrivate:{
        type: Boolean,
        default: false
    },
    profile:{
        type: String
    }
},{timeStamps:true})

module.exports = mongoose.model('Room', roomSchema)