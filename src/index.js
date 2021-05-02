const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages.js')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

let count = 0
io.on('connection', (socket) => {
    console.log('New websocket connection')

    socket.on('join', ({ username, room }) => {
        socket.join(room)
        /*
        Goal: How we're going to communicate with members of a specific room
        Method need to use:
            - io.to.emit
            - socket.broadcast.to.emit
        */
        //Welcome user when you join app
        socket.emit('message', generateMessage('Welcome!'))

        //notification to all users connected server
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`))

    })

    //Send message to another user connected server
    socket.on('sendMessage', (message, callback) => {
        //filter language in the message after you enter
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return console.log('Profanity is not allowed!')
        }
        io.to('NuiThanh Town').emit('message', generateMessage(message))
        callback()
    })

    //Share your location to another user connected server
    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage(coords))
        callback()
    })

    //notification to another user when have a user leave server
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left!'))
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})