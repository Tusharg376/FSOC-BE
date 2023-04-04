const express = require('express')
const router = express.Router()
const {userCreate,userLogin} = require('../controller/userController/user')

router.post('/createUser' , userCreate)
router.post('/login', userLogin)

module.exports = router