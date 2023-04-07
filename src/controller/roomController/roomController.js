const roomServices = require('../../services/room/roomServices')
const validations = require('../../utils/validations/validations')
const uploadFile = require('../../utils/middlewares/aws')

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
                if(!validations.isValidMongooseId(temp[i])) return res.status(400).send({status:false, message:"invalid user id"})
                data.users.push(temp[i])
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

        //=--=-=-=-=-=-=- create room -=-=-=-=-=-==-//
        let finalData = await roomServices.createRoom(data)
    
        return res.status(201).send({status:true,message:finalData})
        
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}

const addMember = async function(req,res){
    try {
        let data = req.body
        let {roomId,userId} = data
    
        //=--==-==-=-=- roomId validation =-=-==-=-// 
        if(!roomId) return res.status(400).send({status:false,message:"please enter roomId"})
        if(!validations.isValidMongooseId(roomId)) return res.status(400).send({status:false,message:"invalid room id"})
    
        //-=-=-=-=-=-=-userId validation =-=-=-=--=//
        if(!userId) return res.status(400).send({status:false,message:"please enter userId"})
        if(!validations.isValidMongooseId(userId)) return res.status(400).send({status:false,message:"invalid user id"})
    
        //=-=-=-=-check if user already addedin room=-=-=-//
        let roomDetails = await roomServices.getRoom(roomId)
        if(!roomDetails) return res.status(400).send({status:false,message:"room not found"})
        let usersArray = roomDetails.users
        if(usersArray.includes(userId)) return res.status(400).send({status:false,message:"user already added in room"})
        
        //=-==-=- Check if user is admin or not if the room is private=-==-=-==-=//
        if(roomDetails.isPrivate == true){
            if(roomDetails.roomAdmin != req.decode.userId) return res.status(400).send({status:false,message:"only admin can add a member"})
        }
        
        //=-=-=-=-==addition of user in room =-=-=--=-==-//
        let finalData = await roomServices.updateRoom(roomId, userId)
        return res.status(200).send({status:true,message:finalData})

    } catch (error) {
        return res.status(500).send({status:false,message:error.message});
    }

}

const renameRoom = async function(req,res){
    
    try {
        let data = req.body
        
        //=-====-=-=-=-=- room Id validations =-=-=-=-==-==-=-=-//
        if(!data.roomId) return res.status(400).send({status:false,message:"please provide room Id"})
        if(!validations.isValidMongooseId(data.roomId)) return res.status(400).send({status:false,message:"invalid room id"})
    
        //=-==-==-=-=-=-= Room Name validation =-=-=-=-=-=-=-=-=//
        if(!data.roomName) return res.status(400).send({status:false,message:"please provide room name"})
        
        //=-==-==-=-=-=-= Admin validation =-=-=-=-=-=-=-=-=//
        let roomDetails = await roomServices.getRoom(data.roomId)
        if(!roomDetails) return res.status(400).send({status:false,message:"room not found"})
        if(roomDetails.isPrivate == true){
            if(roomDetails.roomAdmin!= req.decode.userId) return res.status(400).send({status:false,message:"only admin can rename a room"})
        }
    
        //=-=-=-==-=-=-= Chenge Room Name =-=-=-=-=-=-=-=-=-//
        let finalData = await roomServices.updateRoomName(data.roomId,data.roomName)
        return res.status(200).send({status:true, data:finalData})
    } catch (error) {
        return res.status(500).send({status:false, message:error.message})
    }
}

const removeMember = async function(req,res){
    try {

        let data = req.body;
    
        //=-=-=-=-=-=- Validation for Room ID =-=-==-=-=-//
        if(!data.roomId) return res.status(400).send({status:false,message:"please provide room Id"})
        if(!validations.isValidMongooseId(data.roomId)) return res.status(400).send({status:false,message:"invalid room id"})
    
        //=-=-=-=-=-=-=-=- Room Data =-=-=-=-=-=-=-=-=-//
        let roomDetails = await roomServices.getRoom(data.roomId)
        if(!roomDetails) return res.status(400).send({status:false,message:"room not found"})    
        
        //=-=-=--=-=-= Validation for UserId =-=-=-=-=-=-//
        if(!data.userId) return res.status(400).send({status:false,message:"please provide userId"})
        if(!validations.isValidMongooseId(data.userId)) return res.status(400).send({status:false,message:"invalid user id"})
        let usersArray = roomDetails.users
        if(!usersArray.includes(data.userId)) return res.status(400).send({status:false,message:"user already removed or not in group"})
        
        //=-===-=-=-=-= Admin Validation =-=-=-=-=-=-=-=-=//
        if(roomDetails.roomAdmin!= req.decode.userId) return res.status(400).send({status:false,message:"only admin can remove a member"})
    
        //=-=-=-==-=-=-=- Remove Member =-=-=-=-=-=-=-=-=-//
        let finalData = await roomServices.removeMember(data.roomId,data.userId)
        return res.status(200).send({status:true,data:finalData})  
    
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }  
}

module.exports = {createRoom,addMember,renameRoom,removeMember}