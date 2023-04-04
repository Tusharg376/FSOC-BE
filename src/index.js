const express = require('express')
const app = express()
const port = 3001
const routes = require('./routes/routes')
const db = require('./db/connectDB')
app.use(express.json())

app.use('/',routes)

db.connectDB

app.listen(port, function(){
    console.log(`server is connected on port ${port}`)
})
