document.addEventListener('DOMContentLoaded', () => {

    // Variables declaration
    const socket = io()


    // Get my player num
    socket.on('player-number', num => {
        if (num == -1) {
            // Display server full
            document.getElementById("server-full").style.zIndex = "1"
        } else {
            // Player initialization
            playerNum = parseInt(num)
            var player = document.getElementById("p" + String(playerNum))
            document.getElementById('p' + String(playerNum)).style.border = "5px solid black"
            document.getElementById('p' + String(playerNum)).style.zIndex = "1"
            xPosition = 10 + 530*Math.random()
            yPosition = 10 + 530*Math.random()
            player.style.left = xPosition + 'px'
            player.style.top = yPosition + 'px'


            // Move
            var Keys = {
                up: false,
                down: false,
                left: false,
                right: false
            };
            window.onkeydown = function(e) {
                var kc = e.keyCode;
                e.preventDefault();

                if      (kc === 37) Keys.left = true;  //only one key per event
                else if (kc === 38) Keys.up = true;    //so check exclusively
                else if (kc === 39) Keys.right = true;
                else if (kc === 40) Keys.down = true;
            };
            window.onkeyup = function(e) {
                var kc = e.keyCode;
                e.preventDefault();

                if      (kc === 37) Keys.left = false;
                else if (kc === 38) Keys.up = false;
                else if (kc === 39) Keys.right = false;
                else if (kc === 40) Keys.down = false;
            };
            setInterval(function(){
                var yPosition = parseInt(window.getComputedStyle(player).getPropertyValue("top"));
                var xPosition = parseInt(window.getComputedStyle(player).getPropertyValue("left"));

                if (Keys.up) {
                    if(yPosition > 0) {
                        player.style.top = (yPosition - 3) + "px";
                    }  
                }
                else if (Keys.down) {
                    if(yPosition < 541)
                    player.style.top = (yPosition + 3) + "px";
                }
            
                if (Keys.left) {
                    if(xPosition > 0)
                    player.style.left = (xPosition - 3) + "px"
                }
                else if (Keys.right) {
                    if(xPosition < 541)
                    player.style.left = (xPosition + 3) + "px"
                }

                // Emit player position
                dataPosition = [xPosition, yPosition, playerNum]
                socket.emit('position-player', dataPosition)
            },10);


            // Refresh all the players on the client sreen & log
            socket.on('refresh-positions', data => {
                // Positions & zIndex
                for(let i = 0; i<5; i++){
                    if(i != playerNum){
                        document.getElementById('p' + String(i)).style.left = data[0][i][0] + 'px'
                        document.getElementById('p' + String(i)).style.top = data[0][i][1] + 'px'
                        document.getElementById('p' + String(i)).style.zIndex = data[1][i]
                    }
                }
                // Log
                for(let i=0; i<7; i++){
                document.getElementById("l" + String(i)).innerHTML = data[2][i]
                }   
            })
        }
    })
})