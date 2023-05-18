const roomServices = require('../../services/room/roomServices')
const validations = require('../../utils/validations/validations')
const uploadFile = require('../../utils/middlewares/aws')
const userServices = require('../../services/user/userServices')

const getAllRooms = async function(req,res){
    try {

        //=-=-=-=-=- Getting User Id from token =-=-=-=-=-//
        let userId = req.decode.userId

        //=-=-=-=-=-=-=-= getting room data =-=-=-=-=-=-=-//
        let userRoomNames = await userServices.getUserData(userId)
        
        return res.status(200).send({status:false,data:userRoomNames})
    } catch (error) {
        return res.status(500).send({status:false,message:error.message});
    }
}

const createRoom = async function(req,res){
    try {
        let data = req.body
        let {roomName,users,isPrivate} = data
        let files = req.files

        //=--=-=-=-=-=-=-roomName validation=-===-=-=-=-==-//
        if(!roomName) {
            return res.status(400).send({status:false,message: 'Room name is required'})
        }else{
            data.roomName = roomName.trim()
        }

        //=--=-=-=-=-=-=-users validation=-===-=-=-=-==-//
        if(users){
            let temp = users.split(",")
            data.users = []
            for(let i=0;i<temp.length;i++){
                if(!validations.isValidEmail(temp[i])) return res.status(400).send({status:false, message:"invalid email id"})
                let check = await userServices.emailCheck(temp[i])
                if(!check) return res.status(400).send({status:false, message:`user not fount for email ${temp[i]}`})
                else data.users.push(check._id)
            }
        }
        
        //=--=-=-=-=-=-=-isPrivate validation=-===-=-=-=-==-//
        if(isPrivate != "true" && isPrivate != "false"){
            return res.status(400).send({status:false, message:"invalid Isprivate input"})
        }

        //=-==-==-==-=-=- profile validation=-=-=-=-=--=-==//
        if(files && files.length > 0){
            let url = await uploadFile(files[0])
            data.profile = url
        }else{
            data.profile = "https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/bookCover/no-profile-picture-6-1024x1024.jpg"
        }

        //=-===--=--=-=-== adding AdminID in data =-===-=-=-=--=-//
        data.roomAdmin = req.decode.userId

        //=--=-=-=-=-=-=-=-=-=- create room -=-=-===-=-=-=-=-==-//
        let finalData = await roomServices.createRoom(data)

        //=-=-=-=-=-=- adding room Id in user data =-=-=-=-=-=-=-=//
        await userServices.addRoom(data.roomAdmin,finalData._id)
        if(users){
            for(let i=0 ;i<data.users.length;i++){
                await userServices.addRoom(data.users[i], finalData._id)
            }
        }

        return res.status(201).send({status:true,message:finalData})
        
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}

const getRoomByRoomId = async function(req,res){ 
   try {
     //=-=-=-=-=-=-= getting room Id from params =-=-=-=-//
     let roomId = req.params.roomId
    
     if(!roomId) return res.status(400).send({status:false,message:"room id not found"})
     if(!validations.isValidMongooseId(roomId)) return res.status(400).send({status:false,message:"invalid room id"})
     //=-=-=-=-=-=-= getting room Data =-=-=-=-=-=-//
     let roomData = await roomServices.getRoomData(roomId)
 
     //=-=-=-=-=-== return room Data =-=-=-=-=-=-=-=-//
     return res.status(200).send({status:true,data:roomData})
   
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
   }
}

const addMember = async function(req,res){
    try {
        let data = req.body
        let roomId = req.params.roomId

        if(!data) return res.status(400).send({status:false, message:"provide email"})
        let {email} = data
        //=--==-==-=-=- roomId validation =-=-==-=-// 
        if(!roomId) return res.status(400).send({status:false,message:"please enter roomId"})
        
        if(!validations.isValidMongooseId(roomId)) return res.status(400).send({status:false,message:"invalid room id"})
    
        //-=-=-=-=-=-=-emailId validation =-=-=-=--=//
        if(!email) return res.status(400).send({status:false,message:"please enter email"})
        if(!validations.isValidEmail(email)) return res.status(400).send({status:false,message:"invalid email id"})
    
        //=-=-=-=-check if user already addedin room=-=-=-//
        //=-=-=-=- user data =-=-=-=// 
        let userCheck = await userServices.emailCheck(email)
        if(!userCheck) return res.status(400).send({status:false,message:`user not found for email ${email}`})
        //-=-=-=-= room data =-=-=-=//
        let roomDetails = await roomServices.getRoom(roomId)
        if(!roomDetails) return res.status(400).send({status:false,message:"room not found"})
        let usersArray = roomDetails.users
        if(usersArray.includes(userCheck._id)) return res.status(400).send({status:false,message:"user already added in room"})
        
        //=-==-=- Check if user is admin or not if the room is private=-==-=-==-=//
        if(roomDetails.isPrivate == true){
            if(roomDetails.roomAdmin != req.decode.userId) return res.status(400).send({status:false,message:"only admin can add a member"})
        }
        
        //=-=-=-=-==addition of user in room =-=-=--=-==-//
        let finalData = await roomServices.updateRoom(roomId, userCheck._id)

        //=-=-=-=-=-addition of roomId in user data =-=-=-=//
        await userServices.addRoom(userCheck._id, roomId)

        return res.status(200).send({status:true,message:finalData})

    } catch (error) {
        return res.status(500).send({status:false,message:error.message});
    }

}

const renameRoom = async function(req,res){
    
    try {
        let data = req.body
        let roomId = req.params.roomId        
        //=-====-=-=-=-=- room Id validations =-=-=-=-==-==-=-=-//
        if(!roomId) return res.status(400).send({status:false,message:"please provide room Id"})
        if(!validations.isValidMongooseId(roomId)) return res.status(400).send({status:false,message:"invalid room id"})
    
        //=-==-==-=-=-=-= Room Name validation =-=-=-=-=-=-=-=-=//
        if(!data.roomName) return res.status(400).send({status:false,message:"please provide room name"})
        
        //=-==-==-=-=-=-= Admin validation =-=-=-=-=-=-=-=-=//
        let roomDetails = await roomServices.getRoom(roomId)
        if(!roomDetails) return res.status(400).send({status:false,message:"room not found"})
        if(roomDetails.isPrivate == true){
            if(roomDetails.roomAdmin!= req.decode.userId) return res.status(400).send({status:false,message:"only admin can rename a room"})
        }
    
        //=-=-=-==-=-=-= Chenge Room Name =-=-=-=-=-=-=-=-=-//
        let finalData = await roomServices.updateRoomName(roomId,data.roomName)
        return res.status(200).send({status:true, data:finalData})
    } catch (error) {
        return res.status(500).send({status:false, message:error.message})
    }
}

const removeMember = async function(req,res){
    try {

        let data = req.body;
        let roomId = req.params.roomId
    
        //=-=-=-=-=-=- Validation for Room ID =-=-==-=-=-//
        if(!roomId) return res.status(400).send({status:false,message:"please provide room Id"})
        if(!validations.isValidMongooseId(roomId)) return res.status(400).send({status:false,message:"invalid room id"})
    
        //=-=-=-=-=-=-=-=- Room Data =-=-=-=-=-=-=-=-=-//
        let roomDetails = await roomServices.getRoom(roomId)
        if(!roomDetails) return res.status(400).send({status:false,message:"room not found"})    
        
        //=-=-=--=-=-= Validations for User data =-=-=-=-=-=-//

        if(!data.email) return res.status(400).send({status:false,message:"please provide emailId"})
        
        if(!validations.isValidEmail(data.email)) return res.status(400).send({status:false,message:"invalid email id"})
        let userData = await userServices.emailCheck(data.email)
        if(!userData) return res.status(400).send({status:false,message:`user not found for email ${data.email}`})
        let usersArray = roomDetails.users
        if(!usersArray.includes(userData._id)) return res.status(400).send({status:false,message:"user already removed or not in group"})
        
        //=-===-=-=-=-= Admin Validation =-=-=-=-=-=-=-=-=//
        if(roomDetails.roomAdmin!= req.decode.userId) return res.status(400).send({status:false,message:"only admin can remove a member"})
    
        //=-=-=-==-=-=-=- Remove Member =-=-=-=-=-=-=-=-=-//
        let finalData = await roomServices.removeMember(roomId,userData._id)

        //=-=-=-=-=-=- remove room from user data =-=-=-=-=-=-//
        await userServices.removeRoom(userData._id,roomId)

        return res.status(200).send({status:true,data:finalData})  
    
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }  
}

const searchJoinedRoom = async (req, res) => {
   try {
     let data = req.body
     let userId = req.decode.userId
     
     //=-=-=-=-= check if data is present =-=-=-=-=//
     if(!data || !data.searchData) return res.status(400).send({status:false,message:"please provide something to search"})
 
     //=-=-=-=-=-=- Getting room name if it is not given properly or subname is given =-=-=-=-=-=-=-=//
     let regex = new RegExp(data.searchData,'g')
     
     //=-=-=-=-=-= search for room =-=-=-=-=-=-=-=//
     let rooms = await roomServices.searchJoinedRoom(regex,userId)
    
     //=-=-=-=-=-=- Returning rooms =-=-=-=-=-=-=-=//
     return res.status(200).send({status:true,data:rooms})
    
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}

const searchOpenRoom = async (req, res) => {
   try {
     let data = req.body
     let userId = req.decode.userId
     
     //=-=-=-=-= check if data is present =-=-=-=-=//
     if(!data || !data.searchData) return res.status(400).send({status:false,message:"please provide something to search"})
 
     //=-=-=-=-=-=- Getting room name if it is not given properly or subname is given =-=-=-=-=-=-=-=//
     let regex = new RegExp(data.searchData,'g')
     
     //=-=-=-=-=-= search for room =-=-=-=-=-=-=-=//
     let rooms = await roomServices.searchOpenRooms(regex,userId)
    
     //=-=-=-=-=-=- Returning rooms =-=-=-=-=-=-=-=//
     return res.status(200).send({status:true,data:rooms})
    
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}

const getOpenRooms = async (req, res) => {
    
    try {
        //=-=-==-=- getting userId from token =-=-=-=-//
        let userId = req.decode.userId
    
        //=-=-=-=-=- getting rooms data =-=-=-=-=-=-=-//
        let finalData = await roomServices.findRooms(userId)
    
        //=-=-=-=-=- if no rooms found =-=-=-=-=-=-==//
        if(!finalData) return res.status(200).send({status:false, message:"No Rooms found to Join"})
    
        //=-=-=-=-=- sending response =-=-=-=-=-=-=-=-//
        return res.status(200).send({status:true, data:finalData})
    
    } catch (error) {
        return res.status(500).send({status:false, message:error.message})
    }
}

const joinRoom = async function (req,res){
    try {
        //=-=-=-=-=-=-= getting data =-=-=-=-=-==-=-=-//
        let roomId = req.body.roomId
        let userId = req.decode.userId

        if(!roomId) return res.status(400).send({status:false, message:"please provide Room ID"})

        //=-=-=-=-=-=-= updating room data =-=-=-=-==-=//
        await roomServices.updateRoom(roomId, userId)

        //=-=-=-=-=-=-= updateing userData =-==-=-=-=-=//
        await userServices.addRoom(userId, roomId)

        //=-=-=-=-=-=-=-= sending response=-=-=-=-=-=-=//
        return res.status(200).send({status:true, message:"Room Joined Successfully"})
    } catch (error) {
        return res.status(500).send({status:false, message:error.message})    
    }
}

module.exports = {createRoom,addMember,renameRoom,removeMember,getAllRooms,searchJoinedRoom,getRoomByRoomId,joinRoom,getOpenRooms,searchOpenRoom}