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
let bullets = [];
let foods = [];

let lastBulletId = 0;

const MAX_SHIELD = 1000;
const NUM_FOOD = 400;
setupFood();

function setupFood() {

  for (let i = 0; i < NUM_FOOD; i++ ) {
    let foodX = Math.floor(Math.random() * (1920*3)) + 1;
    let foodY = Math.floor(Math.random() * (1080*3)) + 1;
    let foodRadius = Math.floor(Math.random() * 22) + 1;

    let food = {
      x : foodX,
      y : foodY,
      r : foodRadius,
      id : i
    };
    foods.push(food);
  }

}
setInterval(broadcastPlayers, 16);

function broadcastPlayers() {
  for (let i = 0; i < players.length; i++) {
    updatePlayerPosition(players[i]);
  }

  io.sockets.emit('heartbeat', players);
  io.sockets.emit('bullets', bullets);
}



function updatePlayerPosition(player) {
  if (player.shield <= 0) {
    player.x = Math.floor(Math.random() * 1920) + 1;
    player.y = Math.floor(Math.random() * 1080) + 1;
    player.shield = 100;
  } else if (player.shield > MAX_SHIELD) {
    player.shield = MAX_SHIELD;
  }

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

  // constrain - so moving to the edge of the screen
  if (player.x < 0) {
    player.x = 1920*3;
  } else if (player.x > 1920*3) {
    player.x = 0;
  }

  if (player.y < 0) {
    player.y = 1080*3;
  } else if (player.y > 1080*3) {
    player.y = 0;
  }


  updatePlayerEatingFood(player);
  updatePlayerGettingShot(player);


}

function updatePlayerEatingFood(player) {
  for (let i = 0; i < foods.length; i++) {
    if (Math.abs(foods[i].x-player.x) + Math.abs(foods[i].y-player.y) < 21 + foods[i].r) {
      player.shield += foods[i].r;
      let foodX = Math.floor(Math.random() * (1920*3)) + 1;
      let foodY = Math.floor(Math.random() * (1080*3)) + 1;
      foods[i].x = foodX;
      foods[i].y = foodY;

      io.sockets.emit('foods', foods);
    }
  }
}

function updatePlayerGettingShot(player) {
    for (let i = bullets.length -1; i >= 0; i--) {
      if (player.id !== bullets[i].clientId) {
        if (Math.abs(bullets[i].x-player.x) + Math.abs(bullets[i].y - player.y) < 21 + 10) {
          io.sockets.emit('bulletHit', bullets[i].id);
          bullets.splice(i, 1);
          player.shield -= 75;

        }
      }
    }
}
io.sockets.on('connection', function newConnection(socket) {
    console.log("new connection "+ socket.id);
    setupPlayerLastShot(socket);
    socket.emit('foods', foods);

    socket.on('player', function playerMessage(playerData) {
      playerData.id = socket.id;
      playerData.shield = 100;
      playerData.isUp = false;
      playerData.isDown = false;
      playerData.isLeft = false;
      playerData.isRight = false;
      playerData.r = 21;
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


    socket.on('reduceShield', function(){
      for (let i = 0; i < players.length; i++) {
        if (socket.id == players[i].id) {
          players[i].shield -= 75;
        }
      }
    });


    socket.on('removeBullet', function(id){
      for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].id == id) {
          bullets.splice(i, 1);
        }
      }
    });

    socket.on('playerBullets', function(myBullets){
      for (let i = 0; i < myBullets.length; i++) {
        for (let j = 0; j < bullets.length; j++) {
          if (myBullets[i].id == bullets[j].id) {
            console.log("Updating my bullets!");
            console.log(myBullets[i].x + " " + myBullets[i].y);
            bullets[j].x = myBullets[i].x;
            bullets[j].y = myBullets[i].y;
          }
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
      if (timeSinceLastShot > 200) {
        playersLastShot[i].date = Date.now();

        lastBulletId = lastBulletId + 1;
        let bullet = {
          x: player.x,
          y: player.y,
          angle: player.angle,
          id: lastBulletId,
          clientId: player.id
        };
        bullets.push(bullet);
      }
    }
  }
}
