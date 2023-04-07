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
    latestMessage:{
        type: objectId,
        ref: 'message'
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

module.exports = mongoose.model('room', roomSchema)