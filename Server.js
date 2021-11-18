const express = require('express')
const http = require('http')
const app = express()
const fileSystem = require('fs')
const port = 3000
const server = http.createServer(app)
app.use(express.static(__dirname))

const {Server} = require("socket.io")
const io = new Server(server)

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) =>{
    console.log("User connected")
    socket.on('disconnect', () =>{
        console.log("Uer disconnected")
    })

    socket.on("send-transformations", transformations =>{
        socket.broadcast.emit("receive-transformations", transformations)
    })

    socket.on("send-message", message =>{
        socket.broadcast.emit("receive-message", message)
    })
})

server.listen(port, function(error){
    if(error != null){
        console.log("ERROR CREATING SERVER: " + error)
    }
    else{
        console.log("SERVER LISTENING ON: " + port)
    }
})