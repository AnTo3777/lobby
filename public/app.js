document.addEventListener('DOMContentLoaded', () => {


    var t0Display = document.getElementById("t0")
    var t1Display = document.getElementById("t1")
    var t2Display = document.getElementById("t2")
    var t3Display = document.getElementById("t3")
    var t4Display = document.getElementById("t4")
    var t5Display = document.getElementById("t5")
    var t6Display = document.getElementById("t6")



    const socket = io()



    // myConnection
    socket.on('myConnection', () => {
        console.log('hello')
              
    })





    // Get my player num
    socket.on('player-number', num => {
        if (num === 3) {
          infoDisplay.innerHTML = "Sorry, the server is full"
        } else {
          playerNum = parseInt(num)
        }

        // Initialisation
        var player = document.getElementById("p" + String(playerNum))
      
        // Entourer en gras le joueur
        document.getElementById('p' + String(playerNum)).style.border = "3px solid black"
       document.getElementById('p' + String(playerNum)).style.zIndex = "1"


        // Placement initial
        xPosition = 50 + 300*Math.random()
        yPosition = 50 + 300*Math.random()


        socket.on('refresh-positions', data => {
            for(let i = 0; i<3; i++){
                if(i != playerNum){
                    document.getElementById('p' + String(i)).style.left = data[i+1] + 'px'
                    document.getElementById('p' + String(i)).style.top = data[i+4] + 'px'
                    document.getElementById('p' + String(i)).style.zIndex = data[0][0][i]
                }
                // Log
                for(let i=0; i<7; i++){
                    document.getElementById("t" + String(i)).innerHTML = data[7][0][i]
                }


            }
        })



        
        // Move


        /********** List of keys pressed **********/
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
                if(yPosition < 450)
                player.style.top = (yPosition + 3) + "px";
            }
        
            if (Keys.left) {
                if(xPosition > 0)
                player.style.left = (xPosition - 3) + "px"
            }
            else if (Keys.right) {
                if(xPosition < 450)
                player.style.left = (xPosition + 3) + "px"
            }


            dataPosition = [xPosition, yPosition, playerNum]
            socket.emit('position-player', dataPosition)

        },10);









        // Display
        document.getElementById('p' + String(playerNum)).style.left = xPosition + 'px'
        document.getElementById('p' + String(playerNum)).style.top = yPosition + 'px'
    

    })



})