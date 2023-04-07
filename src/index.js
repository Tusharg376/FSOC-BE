const express = require('express')
const app = express()
const routes = require('./routes/routes')
const {connectDb} = require('./db/connectDB')
app.use(express.json())
require('dotenv').config()
const multer = require('multer')
app.use(multer().any())-

app.use('/',routes)

connectDb()

app.listen(process.env.port, function(){
    console.log(`server is connected on port ${process.env.port}`)
})
