const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

let count = 0
io.on('connection', (socket) => {
    console.log('New websocket connection')
    //Welcome user when you join app
    socket.emit('message', 'welcome!')

    //notification to all users connected server
    socket.broadcast.emit('message', 'Co user moi ket noi Server')

    //Send message to another user connected server
    socket.on('sendMessage', (message, callback)=>{
        //filter language in the message after you enter
        const filter = new Filter()
        if(filter.isProfane(message)){
            return console.log('Profanity is not allowed!')
        }
        io.emit('message', message)
        callback()
    })

    //Share your location to another user connected server
    socket.on('sendLocation', (coords, callback)=>{
        io.emit('message', coords)
        callback()
    })
    
    //notification to another user when have a user leave server
    socket.on('disconnect', () => {
        io.emit('message', 'Co user leave Server')
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})