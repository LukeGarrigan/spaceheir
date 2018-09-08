let express = require('express');
let app = express();


let server = app.listen(4000);

app.use(express.static('public'));

console.log("Server is now running");


let socket = require('socket.io');

let io = socket(server);


let playersLastShot = [];
let playerShields = [];

let players = [];



setInterval(broadcastPlayers, 16);

function broadcastPlayers() {
  for (let i = 0; i < players.length; i++) {
    updatePlayerPosition(players[i]);
    console.log(players[i]);
  }

  io.sockets.emit('heartbeat', players);
}

function updatePlayerPosition(player) {
  if (player.isUp) {
    player.y -= 2;
  }
  if (player.isDown) {
    player.y += 2;
  }

  if (player.isLeft) {
    player.x -= 2;
  }

  if (player.isRight) {
    player.x += 2;
  }
}

io.sockets.on('connection', function newConnection(socket) {
    console.log("new connection "+ socket.id);
    setupPlayerLastShot(socket);

    socket.on('player', function playerMessage(playerData) {
      playerData.id = socket.id;
      playerData.shield = 100;
      playerData.isUp = false;
      playerData.isDown = false;
      playerData.isLeft = false;
      playerData.isRight = false;
      players.push(playerData);
    });

    socket.on('bullet', function() {
      for (let i = players.length-1; i >= 0; i--) {
        if (players[i].id == socket.id) {
          processPlayerShooting(players[i], socket);
        }
      }
    });


    socket.on('disconnect', function (){
      console.log("Player disconnected");

      for (let i = players.length-1; i >= 0; i--) {
        if (players[i].id == socket.id) {
          console.log("Splicing " +  socket.id);
          players.splice(i, 1);
        }
      }
      socket.broadcast.emit('playerDisconnected', socket.id);
    });

    socket.on('keyPressed', function(direction){
      for (let i = 0; i < players.length; i++) {
        if (socket.id == players[i].id) {
          if (direction == "up") {
            players[i].isUp = true;
          } else if (direction == "down") {
            players[i].isDown = true;
          } else if (direction == "left") {
            players[i].isLeft = true;
          } else if (direction == "right") {
            players[i].isRight = true;
          }
        }
      }
    });

    socket.on('keyReleased', function(direction){
      for (let i = 0; i < players.length; i++) {
        if (socket.id == players[i].id) {
          if (direction == "up") {
            players[i].isUp = false;
          } else if (direction == "down") {
            players[i].isDown = false;
          } else if (direction == "left") {
            players[i].isLeft = false;
          } else if (direction == "right") {
            players[i].isRight = false;
          }
        }
      }
    });

    socket.on('angle', function(angle){
      for (let i = 0; i < players.length; i++) {
        if (socket.id == players[i].id) {
          players[i].angle = angle;
        }
      }
    });

    socket.on('respawn', function(){
      for (let i = 0; i < players.length; i++) {
        if (socket.id == players[i].id) {
          players[i].x = Math.floor(Math.random() * 1920) + 1;
          players[i].y = Math.floor(Math.random() * 1080) + 1;
          players[i].shield = 100;
        }
      }
    });

    socket.on('reduceShield', function(){
      for (let i = 0; i < players.length; i++) {
        if (socket.id == players[i].id) {
          players[i].shield -= 75;
        }
      }
    });

    socket.on('increaseShield', function(size){
      for (let i = 0; i < players.length; i++) {
        if (socket.id == players[i].id) {
          players[i].shield += size;
        }
      }
    });

});

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
