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
        // console.log(result)
        return result
    } catch (error) {
        throw error
    }
}