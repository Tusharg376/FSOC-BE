const express = require('express')
const router = express.Router()
const {userCreate,userLogin,updateUser,fetchUserData} = require('../controller/userController/userController')
const {createRoom,addMember,renameRoom,removeMember,getAllRooms,searchRoom,getRoomByRoomId} = require('../controller/roomController/roomController')
const {authentication} = require('../utils/middlewares/jwtVerification')
const {sendMessage,allMessages} = require('../controller/messageControler/messagecontroller')


//--------user Routes----------//
router.post('/createUser', userCreate)
router.post('/login', userLogin)
router.put('/updateUser', authentication, updateUser)
router.get('/userData',authentication,fetchUserData)

//--------room Routes----------//
router.get('/rooms',authentication ,getAllRooms)
router.post('/createRoom', authentication ,createRoom)
router.post('/addMember/:roomId', authentication ,addMember)
router.put('/renameRoom/:roomId', authentication ,renameRoom)
router.put('/removeMember/:roomId', authentication ,removeMember)
router.post('/searchRoom',searchRoom)
router.get('/getroom/:roomId',authentication ,getRoomByRoomId)

// //--------Message Routes --------//
router.post('/sendMessage/:roomId',authentication , sendMessage)
router.get('/rooms/:roomId',authentication , allMessages)

router.all('/*', (req, res)=>{
    res.status(404).send({status:false,message:"invalid http request"})
})

module.exports = router