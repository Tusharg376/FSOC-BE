const mongoose = require('mongoose');


module.exports.isValidEmail = (email) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email)
}

module.exports.isValidPhone = (phone) => {
    const ph = /^[6-9]{1}?[0-9]{9}$/
    return ph.test(phone)
}

module.exports.isValidPassword = (password) => {
    const pas = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,15}$/
    return pas.test(password)
}

module.exports.isValidName = (name) => {
    const nm = /^[a-z A-Z_]{2,20}$/
    return nm.test(name)
}

module.exports.isValidMongooseId = (userId) => {
    return mongoose.isValidObjectId(userId)
}
