const mongoose = require('mongoose')

module.exports.connectDB = mongoose.connect(process.env.url,{
    useNewUrlParser:true
})

.then(console.log("database connected"))
.catch((err)=> err.message)

