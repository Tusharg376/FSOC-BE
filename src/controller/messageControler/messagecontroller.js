const messageServices = require("../../services/message/messageServices")
const validations = require("../../utils/validations/validations")
const roomServices = require('../../services/room/roomServices')

const allMessages = async function (req,res){
    try {
        let roomId = req.params.roomId
    
        //=-=-=-=-=-=-=- room Id validation =-=-=-=-=-==// 
        if(!roomId) return res.status(400).send({status:false, message:"didn't got roomId"})
        if(!validations.isValidMongooseId(roomId)) return res.status(400).send({status:false, message:"invalid roomId"})
    
        //=-=-=-=-=-=-=- getting all messages =-=-=-=-=-//
        let messages = await messageServices.getAllMessages(roomId)
    
        return res.status(200).send({status:true, data: messages})
    } catch (error) {
        return res.status(500).send({status:false, message: error.messages})
    }
}

const sendMessage = async function (req,res){
    try {
        //=-=-=-=-=- putting all values in object =-=-=-=-//
        let obj = {}
        obj.roomId = req.params.roomId
        obj.content = req.body.content
        
        //=-=-=-=-=-=- validation if content is missing =-=-=-=-//
        if(!obj.content) return res.status(400).send({status:false, message:"provide content to be sent"})
        
        //=-=-=-=-=-=-= getting userId from token =-=-=-=-=-=-// 
        obj.sender = req.decode.userId
    
        //=-=-=-=-=-=-= saving message =-=-=-=-=-=-//
        let message = await messageServices.sendMessage(obj)
    
        //=-=-=-=-=-=-= updating latest message =-=-==-=-//
        await roomServices.newMessage(obj.roomId,message._id)

        return res.status(200).send({status:true, data: message})

    } catch (error) {
        return res.status(500).send({status:false, message:error.message})
    }
}


module.exports = {allMessages,sendMessage}

