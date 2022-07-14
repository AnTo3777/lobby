const express = require('express')
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
let pos_x_0 = -60
let pos_x_1 = -60
let pos_x_2 = -60
let pos_y_0 = -5
let pos_y_1 = -50
let pos_y_2 = -105

// Set static folder
app.use(express.static(path.join(__dirname, "public")))

// Start server
server.listen(4000)


// Handle a socket connection request from web client
const connections = [null, null, null]


io.on('connection', socket => {
    // Assign a number to the player

    // Find an available player number
    let playerIndex = -1;
    for (const i in connections) {
        if (connections[i] === null) {
        playerIndex = i
        break
        }
    }
    connections[playerIndex] = false

    // Tell the connecting client what player number they are
    socket.emit('player-number', playerIndex)
    console.log(`Player ${playerIndex} has connected`)


    // maj des positions
    socket.on('position-player', (dataPosition) => {
        playerNum = dataPosition[2]
        if(playerNum == 0){
            pos_x_0 = dataPosition[0]
            pos_y_0 = dataPosition[1]
        }
        if(playerNum == 1){
            pos_x_1 = dataPosition[0]
            pos_y_1 = dataPosition[1]
        }
        if(playerNum == 2){
            pos_x_2 = dataPosition[0]
            pos_y_2 = dataPosition[1]
        }

        data = [pos_x_0, pos_x_1, pos_x_2, pos_y_0, pos_y_1, pos_y_2]

        
    

        setInterval(function(){
            socket.emit('refresh-positions', data)

        },20);

    
    
    
      })
})