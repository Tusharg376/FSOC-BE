const {isValidEmail,isValidName,isValidPassword,isValidPhone} = require('../../utils/validations/validations')
const userServices = require('../../services/user/userServices')
const jwt = require('jsonwebtoken')
const uploadFile = require('../../utils/middlewares/aws')
const bcrypt = require('bcrypt')


const userCreate = async function(req,res){
    try {
        let data = req.body
        let files = req.files
        let {name,email,phone,password} = data
        
        //--------Profile Image validation----------------//
        if(files && files.length>0){
            let url = await uploadFile(files[0])
            data.profile = url
        }else{
            data.profile = "https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/bookCover/no-profile-picture-6-1024x1024.jpg"
        }

        //--------Name validation----------------//
        if(!name) return res.status(400).send({status:false,message:"please provide name"})
        else {
            data.name = name.trim()
            if(!isValidName(name)) return res.status(400).send({status:false,message:"invalid Name format"})
        }

        //--------Email validation----------------//
        if(!email) return res.status(400).send({status:false,message:"please provide email"})
        else {
            data.email = email.trim()
            if(!isValidEmail(email)) return res.status(400).send({status:false,message:"invalid Email format"})
        }
        
        //--------Phone validation----------------//
        if(!phone) return res.status(400).send({status:false,message:"please provide phone"})
        else {
            data.phone = phone.trim()
            if(!isValidPhone(phone)) return res.status(400).send({status:false,message:"invalid Phone format"})
        }
        
        //--------Password validation----------------//
        if(!password) return res.status(400).send({status:false,message:"please provide password"})
        else {
            data.password = password.trim()
            if(!isValidPassword(password)) return res.status(400).send({status:false,message:"password must contain atleast one UpperCase,one LowerCase,one Numeric and one special character ranges between 8-15 characters"})
        }
    
        //-----------Duplicate email check---------------//
        let dupEmail = await userServices.emailCheck(email || phone)
        if(dupEmail) return res.status(400).send({status:false,message:"unique email is required"})

        //-----------Duplicate phone check --------------//
        let dupPhone = await userServices.phoneCheck(phone)
        if(dupPhone) return res.status(400).send({status:false,message:"unique phone is required"})

        //--------Password Hashing----------------//
        let hashed = await bcrypt.hash(password,password.length)
        data.password = hashed
        
        //-----------Creation of user data--------------//
        let final = await userServices.createUser(data)
        return res.status(201).send({status:true,message:'registered successfully',data:final})

    } catch (error) {
        return res.status(500).send({status:false,message:error.message})   
    }
}

const userLogin = async function(req,res){
    try {
        let data = req.body
        let {email,password} = data
        
        //--------Email validation----------------//
        if(!email) return res.status(400).send({status:false,message:"please provide email"})
        else data.email = email.trim()

        //--------Password validation----------------//
        if(!password) return res.status(400).send({status:false,message:"please provide password"})
        else data.password = password.trim()
    
        //----check email and password are correct---//
        let creCheck = await userServices.login({email:email})
        if(!creCheck) return res.status(400).send({status:false,message:"User not found"})
       
        //-------------password matching------------//
        let checkPassword = await bcrypt.compare(password,creCheck.password)
        if(!checkPassword) return res.status(400).send({status:false,message:"Invalid password"})

        //-------------token creation--------------// 
        let payload = {userId:creCheck._id, email:creCheck.email}
        let token = jwt.sign(payload,process.env.secretKey)
        res.setHeader("x-api-key", token)
    
        return res.status(200).send({status:true,message:"logged in successfully",email:creCheck.email,token:token,userId:creCheck._id})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

const updateUser = async (req, res) => {
    try {
        let data = req.body
        let files = req.files
        
        //-=-=-=--= check for files if user want to update profile =-=-//
        if(files && files.length>0){
            let url = await uploadFile(files[0])
            data.profile = url
        }
        
        //=-==-==-=transfer of data in obj object =-=-=-//
        let obj = {}
        if(data.name) obj.name = data.name
        if(data.profile) obj.profile = data.profile
        if(Object.entries(obj).length == 0) return res.status(400).send({status:false,message:'no data found for update'})
    
        //-=-=-=-==update user profile -=-=-=-=//
        let finalData = await userServices.updateUser(req.decode.userId,obj)
        return res.status(200).send({status:true,message:'updated successfully',data:finalData})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const fetchUserData = async function(req,res){
    
try {
        //=-=-=-=- getting userId from token =-=-=-=-=//
        let userId = req.decode.userId
    
        //=-=-=-=-==-= getting user data from userId =-=-=-=-=//
        let userData = await userServices.fetchData(userId)
    
        //=-=-=-=-=-=- sending the response -=-=-=-=-=-=-//
        res.status(200).send({status:true,data:userData})
} catch (error) {
    return res.status(500).send({ status: false, message: error.message })
}}


module.exports = {userCreate,userLogin,updateUser,fetchUserData}