const express = require('express')
const router = express.Router()
const {userCreate,userLogin,updateUser} = require('../controller/userController/userController')
const {createRoom,addMember} = require('../controller/roomController/roomController')
const {authentication} = require('../utils/middlewares/jwtVerification')

//--------user Routes----------//
router.post('/createUser', userCreate)
router.post('/login', userLogin)
router.put('/updateUser', authentication, updateUser)

//--------room Routes----------//
router.post('/createRoom' ,authentication ,createRoom)
router.post('/addMember', authentication ,addMember)

module.exports = router