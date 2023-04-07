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