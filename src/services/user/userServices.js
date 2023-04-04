const userModel = require('../../utils/models/userModel')

module.exports.emailCheck = async (email) => {
    try {
        // console.log(email)
        let result =  await userModel.findOne(email)
        return result
    } catch (error) {
        throw error.message
    }
}

module.exports.createUser = (data) => {
    try {
        return userModel.create(data)
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.login = (data) => {
    try {
        return userModel.findOne(data)
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}