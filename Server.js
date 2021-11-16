const http = require('http')
const express = require('express')
const app = express()
const fileSystem = require('fs')


const port = 3000

const server = http.createServer(app)

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html')
})

// const server = http.createServer(function(req, res){
//     res.writeHead(200, {'Content-Type': 'text/html'})
//     fileSystem.readFile('index.html', function(error, data){
//         if(error){
//             res.writeHead(404)
//             res.write("ERROR READING HTML FILE: " + error)
//         }
//         else{
//             res.write(data)
//         }
//         res.end()

//     })
// })

server.listen(port, function(error){
    if(error != null){
        console.log("ERROR CREATING SERVER: " + error)
    }
    else{
        console.log("SERVER LISTENING ON: " + port)
    }
})

