const express = require('express')
const app = express()
const routes = require('./routes/routes')
const {connectDb} = require('./db/connectDB')
app.use(express.json())
require('dotenv').config()
const multer = require('multer')
const cors = require('cors')
app.use(multer().any())

app.use(cors({origin:"*"}))

connectDb()

app.use('/',routes)

let server = app.listen(process.env.port, function(){
    console.log(`server is connected`)
})
