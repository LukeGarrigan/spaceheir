let express = require('express');
let app = express();


let server = app.listen(4000);

app.use(express.static('public'));

console.log("Server is now running");


let socket = require('socket.io');

let io = socket(server);


let playersLastShot = [];
let playerShields = [];
// playerId
// time
//

io.sockets.on('connection', function newConnection(socket){
    console.log("new connection "+ socket.id);
    setupPlayerShield(socket);
    setupPlayerLastShot(socket);


    socket.on('player', function playerMessage(playerData) {
      playerData.id = socket.id;
      socket.broadcast.emit('player', playerData);
    });

    socket.on('bullet', function(player) {
      processPlayerShooting(player, socket);
    });

    socket.on('shield', function(playerShield) {
      console.log("changing shield")
      for (let i = 0; i < playerShields.length; i++) {
        if (socket.id == playerShields[i].id) {
          playerShields[i].shield += playerShield.shield;
        }
      }
    });

    socket.on('disconnect', function (){
      socket.broadcast.emit('playerDisconnected', socket.id);
    });
});


function setupPlayerShield(socket) {
  console.log("Setting up shield");
  let playerShield = {
    id : socket.id,
    shield : 0
  }
  playerShields.push(playerShield);
}

function setupPlayerLastShot(socket) {
  let playerLastShot = {
    id : socket.id,
    date : Date.now()
  }
  playersLastShot.push(playerLastShot);
}
function processPlayerShooting(player, socket) {
  for (let i = 0; i < playersLastShot.length; i++) {
    if (playersLastShot[i].id == socket.id) {
      let previousShot = playersLastShot[i].date;
      let timeSinceLastShot = Date.now()-previousShot;
      console.log(timeSinceLastShot);
      if (timeSinceLastShot > 200) {
        console.log("Has been longer..");
        playersLastShot[i].date = Date.now();
        socket.broadcast.emit('bullet', player);
      }
    }
  }
}
