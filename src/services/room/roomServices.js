const roomModel = require('../../models/roomModel')

module.exports.createRoom = async(data) =>{
    try{
        let result = await roomModel.create(data)
        return result
    }catch(err){
        throw err.message
    }
}

module.exports.getRoom = async function(data){
    try{
        let result = await roomModel.findOne({_id:data})
        return result
    }catch(err){
        throw err.message
    }
}

module.exports.updateRoom = async function(roomId,data){
    try{
        let result = await roomModel.findOneAndUpdate({_id:roomId},{$push:{users:data}} ,{new:true})
        return result
    }catch(err){
        throw err.message
    }
}

module.exports.updateRoomName = async function(roomId, data){
    try{
        let result = await roomModel.findOneAndUpdate({_id:roomId},{$set:{roomName:data}},{new:true})
        return result
    }catch(err){
        throw err.message
    }
}

module.exports.removeMember = async function (roomId,data){
    try{
        let result = await roomModel.findOneAndUpdate({_id:roomId},{$pull:{users:data}},{new:true})
        return result
    }catch(err){
        throw err.message
    }
}

module.exports.allRooms = async function (data) {
    try{
        let result = await roomModel.find({users:{$eq:data}})
        return result
    }catch(err){
        throw err.message
    }
}

module.exports.newMessage = async function(roomId,data) {
    try{
        let result = await roomModel.findOneAndUpdate({_id:roomId}, {$set:{latestMessage:data}},{new:true})
        return result
    }catch(err){
        throw err.message
    }
}

module.exports.getMessage = async function(data){
    try{
        let result = await roomModel.findOne({latestMessage:data}).populate("latestMessage")
        return result
    }catch(err){
        throw err.message
    }
}

module.exports.getUserData = async function(userId){
    try {
        let result = await roomModel.find({users:{$in:[userId]}})
        return result
    } catch (error) {
        throw error.message
    }
}

module.exports.userCheck = async function(roomId,userId){
    try{
        let result = await roomModel.findOne({_id:roomId,users:{$in:[userId]}})
        return result
    }catch(err){
        throw err.message
    }
}

module.exports.searchRoom = async function(data){
    try{
        let result = await roomModel.find({roomName:data}).select({roomName:1})
        return result
    }catch(err){
        throw err.message
    }
}

module.exports.getRoomData = async function(roomId){
    try {
        let result = await roomModel.findById(roomId).select({roomName:1,profile:1})
        return result
    } catch (error) {
        throw error
    }
}