const userModel = require('../../models/userModel')
const {isValidEmail,isValidName,isValidPassword,isValidPhone} = require('../../utils/validations/validations')
const userServices = require('../../services/user/userServices')
const jwt = require('jsonwebtoken')

const userCreate = async function(req,res){
    try {
        let data = req.body
        let {name,email,phone,password} = data
        
        //validations of the fields
        if(!name) return res.status(400).send({status:false,message:"please provide name"})
        else {
            data.name = name.trim()
            if(!isValidName(name)) return res.status(400).send({status:false,message:"invalid Name format"})
        }
        if(!email) return res.status(400).send({status:false,message:"please provide email"})
        else {
            data.email = email.trim()
            if(!isValidEmail(email)) return res.status(400).send({status:false,message:"invalid Email format"})
        }
        if(!phone) return res.status(400).send({status:false,message:"please provide phone"})
        else {
            data.phone = phone.trim()
            if(!isValidPhone(phone)) return res.status(400).send({status:false,message:"invalid Phone format"})
        }
        if(!password) return res.status(400).send({status:false,message:"please provide password"})
        else {
            data.password = password.trim()
            if(!isValidPassword) return res.status(400).send({status:false,message:"password must contain atleast one UpperCase,one LowerCase,one Numeric and one special character ranges between 8-15 characters"})
        }
    
        // duplicate email check
        let dupEmail = await userServices.emailCheck(email || phone)
        if(dupEmail) return res.status(400).send({status:false,message:"unique email is required"})

        //duplicate phone
        let dupPhone = await userServices.phoneCheck(phone)
        if(dupPhone) return res.status(400).send({status:false,message:"unique phone is required"})

        //creation of user data
        let final = await userServices.createUser(data)
        // let final = await userModel.create(data)
        return res.status(201).send({status:true,message:'registered successfully',data:final})

    } catch (error) {
        return res.status(500).send({status:false,message:error.message})   
    }
}

const userLogin = async function(req,res){
    try {
        let data = req.body
        let {email,password} = data
    
        //validations 
        if(!email) return res.status(400).send({status:false,message:"please provide email"})
        else data.email = email.trim()
        if(!password) return res.status(400).send({status:false,message:"please provide password"})
        else data.password = password.trim()
    
        //check email and password are correct
    
        let creCheck = await userServices.login({email:email,password:password})
        if(!creCheck) return res.status(400).send({status:false,message:"email or password is incorrect"})
    
        // token creation 
        let payload = {userId:creCheck._id, email:creCheck.email}
        let token = jwt.sign(payload,'fsocCali',{expiresIn:"2h"})
        res.setHeader("x-api-key", token)
    
        return res.status(200).send({status:true,message:"logged in successfully",data:{email:creCheck.email,token:token}})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}
module.exports = {userCreate,userLogin}