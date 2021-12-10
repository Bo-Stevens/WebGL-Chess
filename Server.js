const express = require('express')
const http = require('http')
const app = express()
const fileSystem = require('fs')
const port = 3000
const server = http.createServer(app)
app.use(express.static(__dirname))

const {Server} = require("socket.io")
const io = new Server(server)

var numPlayers = 0

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) =>{
    console.log("User connected")

    socket.emit("connected", numPlayers)
    numPlayers += 1

    socket.on('disconnect', () =>{
        numPlayers -= 1
        console.log("User disconnected" + numPlayers)

    })
    socket.on("send-transformations", transformations =>{
        socket.broadcast.emit("receive-transformations", transformations)
        // socket.in("0").emit("receive-transformations", transformations)
    })
    socket.on("send-gameObjects", transformations =>{
        socket.broadcast.emit("receive-gameObjects", transformations)
    })

    socket.on("send-message", message =>{
        socket.broadcast.emit("receive-message", message)
    })

    socket.on("send-turn-ended", pieceType =>{
        socket.broadcast.emit("receive-turn-ended", pieceType)
    })

    socket.on("send-piece-positions", piecePositions =>{
        socket.broadcast.emit("receive-piece-positions", piecePositions)
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