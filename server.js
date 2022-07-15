// initialization
const express = require('express')
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 4000
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Set static folder
app.use(express.static(path.join(__dirname, "public")))

// Start server
server.listen(3700)





// Variables declaration
const connectionsArray = [null, null, null, null, null]
const zIndexArray = ["-1", "-1", "-1", "-1", "-1"]
let logCount = 0
var logArray = ["", "", "", "", "", "", ""]
const positionsAllPlayers = [ [50,50] , [50,50] , [50,50] , [50,50] , [50,50] ]





// Function refresh
function refreshLog (playerIndex, type) {
    logCount ++
    if(logCount > 7){
        logArray[0] = logArray[1]
        logArray[1] = logArray[2]
        logArray[2] = logArray[3]
        logArray[3] = logArray[4]
        logArray[4] = logArray[5]
        logArray[5] = logArray[6]
        if(type === 'connection'){
            logArray[6] = `player ${Number(playerIndex) + 1} has connected`
        } else {
            logArray[6] = `player ${Number(playerIndex) + 1} disconnected`
        }

    }
    else {
        logModification = false
        for(let i=0; i<=7; i++) {
            if(logArray[i] == "" && logModification == false){
                if(type === 'connection'){
                    logArray[i] = `player ${Number(playerIndex) + 1} has connected`
                } else {
                    logArray[i] = `player ${Number(playerIndex) + 1} disconnected`
                }
                logModification = true
            }
        }
    }
}





// When connection
io.on('connection', socket => {

        // Assign a number to the player and display him
        let playerIndex = -1;
        for (let i in connectionsArray) {
            if (connectionsArray[i] === null) {
            playerIndex = i
            break
            }
        }
        connectionsArray[playerIndex] = false
        if(playerIndex >= 0) {
            zIndexArray[playerIndex] = "1"
        }
        
        // Tell the connecting client what player number they are
        socket.emit('player-number', playerIndex)
        console.log(`Player ${playerIndex} has connected`)


        // Refresh log
        if(playerIndex >= 0) {
            refreshLog(playerIndex, 'connection')
        }

    

        // When deconnection
        socket.on('disconnect', () => {

            // Remove the player from the box
            console.log(`Player ${playerIndex} disconnected`)
            connectionsArray[playerIndex] = null
            zIndexArray[playerIndex] = -1
            for(let i=0 ; i<5 ; i++) {
                if(i == playerIndex) {
                    positionsAllPlayers[i][0] = 60
                    positionsAllPlayers[i][1] = 10
                }
            }

            // Refresh log
            if(pplayerIndex >= 0) {
                refreshLog(playerIndex, 'deconnection')
            }
        })
    
    
        // refresh data 
        socket.on('position-player', (dataPosition) => {
            playerNum = dataPosition[2]
            for(let i=0 ; i<5 ; i++) {
                if(i == playerNum) {
                    positionsAllPlayers[i][0] = dataPosition[0]
                    positionsAllPlayers[i][1] = dataPosition[1]
                }
            }
            data = [positionsAllPlayers, zIndexArray, logArray]


            // Send data to all players
            socket.emit('refresh-positions', data)
        })
})