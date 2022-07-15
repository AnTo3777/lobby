const express = require('express')
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 4000
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
let pos_x_0 = 0
let pos_x_1 = 60
let pos_x_2 = 120
let pos_y_0 = 10
let pos_y_1 = 10
let pos_y_2 = 10

// Set static folder
app.use(express.static(path.join(__dirname, "public")))

// Start server
server.listen(PORT)


// Handle a socket connection request from web client
const connections = [null, null, null]
const data_zI = ["-1", "-1", "-1"]

var nb_log = 0
var data_text = ["", "", "", "", "", "", ""]


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
    data_zI[playerIndex] = "1"


    // Log
    nb_log ++

    console.log(nb_log)
    if(nb_log > 7){

        data_text[0] = data_text[1]
        data_text[1] = data_text[2]
        data_text[2] = data_text[3]
        data_text[3] = data_text[4]
        data_text[4] = data_text[5]
        data_text[5] = data_text[6]
        
        data_text[6] = `Player ${playerIndex} has connected`

    }
    else {
        deja_modife = false
        for(let i=0; i<=7; i++) {
            if(data_text[i] == "" && deja_modife == false){
                data_text[i] = `Player ${playerIndex} has connected`
                 deja_modife = true

                //data_text[i] = `Player ${data_log[0]} ${data_log[1]}`
                //deja_modife = true
            }
        }
    }

    

    // Tell the connecting client what player number they are
    socket.emit('player-number', playerIndex)
    console.log(`Player ${playerIndex} has connected`)


    // Handle Diconnect
    socket.on('disconnect', () => {
        console.log(`Player ${playerIndex} disconnected`)
        connections[playerIndex] = null
        data_zI[playerIndex] = -1
        if(playerIndex == 0) {
            pos_x_0 = 0
            pos_y_0 = 0
        }
        if(playerIndex == 1) {
            pos_x_1 = 0
            pos_y_1 = 0
        }
        if(playerIndex == 2) {
            pos_x_2 = 0
            pos_y_2 = 0
        }

        nb_log ++
        if(nb_log >= 7){
        data_text[0] = data_text[1]
        data_text[1] = data_text[2]
        data_text[2] = data_text[3]
        data_text[3] = data_text[4]
        data_text[4] = data_text[5]
        data_text[5] = data_text[6]
        data_text[6] = `Player ${playerIndex} disconnected`
        }
        else {
            deja_modife = false
            for(let i=0; i<=7; i++) {
                if(data_text[i] == "" && deja_modife == false){
                    data_text[i] = `Player ${playerIndex} disconnected`
                    deja_modife = true
                }
            }
        }

    })


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

        data = [[data_zI], pos_x_0, pos_x_1, pos_x_2, pos_y_0, pos_y_1, pos_y_2, [data_text]]

        socket.emit('refresh-positions', data)

    })



    
})