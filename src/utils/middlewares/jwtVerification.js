let jwt = require('jsonwebtoken')

const authentication = async function(req,res,next){
   try {
     let token = req.headers['x-api-key']
     if(!token){
         return res.status(401).send({status:false,message:'please provide token'})
     }
     jwt.verify(token,process.env.secretKey,(err,decode) => {
         if(err){ return res.status(400).send({status:false,message :err.message})}
         req.decode = decode
     })
     next()
   } catch (error) {
        return res.status(500).send({status:false,message :error.message})
   }
}

module.exports = {authentication}