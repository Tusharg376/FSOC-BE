const express = require('express')
const router = express.Router()
const {userCreate,userLogin,updateUser} = require('../controller/userController/userController')
const {createRoom,addMember,renameRoom,removeMember,getAllRooms} = require('../controller/roomController/roomController')
const {authentication} = require('../utils/middlewares/jwtVerification')

//--------user Routes----------//
router.post('/createUser', userCreate)
router.post('/login', userLogin)
router.put('/updateUser', authentication, updateUser)

//--------room Routes----------//
router.get('/rooms',authentication ,getAllRooms)
router.post('/createRoom', authentication ,createRoom)
router.post('/addMember', authentication ,addMember)
router.put('/renameRoom', authentication ,renameRoom)
router.put('/removeMember', authentication ,removeMember)


//--------Message Routes --------//


module.exports = router