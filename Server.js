const http = require('http')
const express = require('express')
const app = express()
const fileSystem = require('fs')


const port = 3000

const server = http.createServer(app)
app.use(express.static(__dirname))
app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html')
})

server.listen(port, function(error){
    if(error != null){
        console.log("ERROR CREATING SERVER: " + error)
    }
    else{
        console.log("SERVER LISTENING ON: " + port)
    }
})

