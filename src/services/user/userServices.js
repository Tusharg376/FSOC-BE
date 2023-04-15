const userModel = require('../../models/userModel')


module.exports.emailCheck = async (email) => {
    try {
        let result =  await userModel.findOne({email:email})
        return result
    } catch (error) {
        throw error
    }
}

module.exports.phoneCheck = async function(phone) {
    try {
        let result =  await userModel.findOne({phone:phone})
        return result
    } catch (error) {
        throw error
    }
}

module.exports.createUser = async (data) => {
    try {
        return await userModel.create(data)
    } catch (error) {
        throw error
    }
}

module.exports.login = async (data) => {
    try {
        let result = await userModel.findOne(data)
        return result
    } catch (error) {
        throw error
    }
}

module.exports.updateUser = async (userId,data) => {
    try {
       return await userModel.findOneAndUpdate({_id: userId},{$set:{...data}},{new:true})
    } catch (error) {
        throw error
    }
}

module.exports.getUserData = async (userId) => {
    try {
        let result = await userModel.findById(userId).select({rooms:1,_id:0})
        .populate("rooms",{roomName:1,profile:1})
        return result
    } catch (error) {
        throw error
    }
}

module.exports.addRoom = async function(userId,roomId){
    try {
        let result = await userModel.findOneAndUpdate({_id:userId},{$push:{rooms:roomId}},{new:true})
        return result
    } catch (error) {
        throw error
    }
}

module.exports.removeRoom = async function(userId,roomId){
    try {
        let result = await userModel.findOneAndUpdate({_id:userId},{$pull:{rooms:roomId}},{new:true})
        return result
    } catch (error) {
        throw error
    }
}

module.exports.fetchData = async function(userId){
    try {
        let result = await userModel.findById(userId).select({name:1,email:1,profile:1,_id:0})
        return result
    } catch (error) {
        throw error
    }
}