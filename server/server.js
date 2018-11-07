let config = require('../configs/defaults.js')


var compression = require('compression');
let express = require('express');

let app = express();
app.use(compression());

let server = app.listen(80);
app.use(express.static('public'));
console.log("Server is now running");

let socket = require('socket.io');
let io = socket(server);

let playersLastShot = [];
const players = [];
let bullets = [];
let foods = [];
let leaderboard = [];
let lastBulletId = 0;

setupFood();
setInterval(broadcastPlayers, 16);

module.exports = {
  players,
  addNewPlayerToLeaderboard,
  processPlayerShooting,
  leaderboard,
  bullets
}

const events = require('./events');
const eventsList = Object.entries(events);

io.sockets.on('connection', function newConnection(socket) {
  console.log("new connection " + socket.id);

  for (const [event, callback] of eventsList) {
    socket.on(event, (...args) => {
      callback({socket, io}, ...args);
    });
  }

  setupPlayerLastShot(socket);
  socket.emit('foods', foods);
});

function setupFood() {
  for (let i = 0; i < config.settings.NUM_FOOD; i++) {
    let foodX = Math.floor(Math.random() * (config.settings.PLAYAREA_WIDTH)) + 1;
    let foodY = Math.floor(Math.random() * (config.settings.PLAYAREA_HEIGHT)) + 1;
    let foodRadius = Math.floor(Math.random() * 22) + 15;

    let food = {
      x: foodX,
      y: foodY,
      r: foodRadius,
      id: i
    };
    foods.push(food);
  }
}

function broadcastPlayers() {
  for (let i = 0; i < players.length; i++) {
    updatePlayerPosition(players[i]);
  }

  io.sockets.emit('leaderboard', leaderboard);
  io.sockets.emit('heartbeat', players);
  io.sockets.emit('bullets', bullets);
}

function movePlayer(player, playerSpeed) {
  if (player.isUp) {
    player.y -= config.settings.BASE_SPEED + playerSpeed;
  }

  if (player.isDown) {
    player.y += config.settings.BASE_SPEED + playerSpeed;
  }

  if (player.isLeft) {
    player.x -= config.settings.BASE_SPEED + playerSpeed;
  }

  if (player.isRight) {
    player.x += config.settings.BASE_SPEED + playerSpeed;
  }
}


function killPlayer(player) {
  if (config.settings.DEBUG_MODE) {
    player.x = 1000;
    player.y = 1000;
  } else {
    player.x = Math.floor(Math.random() * 1920) + 1;
    player.y = Math.floor(Math.random() * 1080) + 1;
  }

  player.shield = 100;
  player.score = 0;

  const timeOutInSeconds = 5;
  player.lastDeath = new Date();
  player.lastDeath.setSeconds(player.lastDeath.getSeconds() + timeOutInSeconds)

  updateLeaderboard();
  io.sockets.emit('heartbeat', players);
  io.to(player.id).emit('respawn-start', timeOutInSeconds)
  io.to(player.id).emit('playExplosion');
}

function updatePlayerPosition(player) {
  if (player.lastDeath !== null) {
    const currentDate = new Date()
    if (player.lastDeath > currentDate) {
      return
    } else {
      io.to(player.id).emit('respawn-end')
      player.lastDeath = null
    }
  }

  if (player.shield < 0) {
    killPlayer(player);
    return
  } else if (player.shield > config.settings.MAX_SHIELD) {
    player.shield = config.settings.MAX_SHIELD;
  }

  let playerSpeed = player.isBoosting && player.shield > 0 ? 3 : 0;

  if (player.isBoosting && player.shield > 0) {
    player.shield--;
    io.to(player.id).emit('increaseShield', -1);
    playerSpeed = 5;
  } else {
    playerSpeed = 0;
  }
  movePlayer(player, playerSpeed);


  // constrain - so moving to the edge of the screen
  if (player.x < 0) {
    player.x = config.settings.PLAYAREA_WIDTH;
  } else if (player.x > config.settings.PLAYAREA_WIDTH) {
    player.x = 0;
  }

  if (player.y < 0) {
    player.y = config.settings.PLAYAREA_HEIGHT;
  } else if (player.y > config.settings.PLAYAREA_HEIGHT) {
    player.y = 0;
  }
  updatePlayerEatingFood(player);
  updatePlayerGettingShot(player);
  checkPlayerCollision(player);
}

function updatePlayerEatingFood(player) {
  for (let i = 0; i < foods.length; i++) {
    if (Math.abs(foods[i].x - player.x) + Math.abs(foods[i].y - player.y) < 21 + foods[i].r) {
      if (player.shield < config.settings.MAX_SHIELD) {
        player.shield += foods[i].r;
        io.to(player.id).emit('increaseShield', foods[i].r);
      }
      let foodX = Math.floor(Math.random() * (config.settings.PLAYAREA_WIDTH)) + 1;
      let foodY = Math.floor(Math.random() * (config.settings.PLAYAREA_HEIGHT)) + 1;
      foods[i].x = foodX;
      foods[i].y = foodY;
      io.sockets.emit('foods', foods);
    }
  }
}

function updatePlayerGettingShot(player) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].bulletSize < 0) {
      io.sockets.emit('bulletHit', bullets[i].id);
      bullets.splice(i, 1);
    } else {
      processPlayerGettingShotByAnotherPlayer(player, i);
    }

  }
}

function getKiller(clientId) {
  for (let player of players) {
    if (player.id == clientId) {
      return player;
    }
  }
}

function processPlayerGettingShotByAnotherPlayer(player, i) {
  if (player.id !== bullets[i].clientId) {
    if (Math.abs(bullets[i].x - player.x) + Math.abs(bullets[i].y - player.y) < 21 + 10) {
      io.sockets.emit('bulletHit', bullets[i].id);

      player.shield -= 75;
      io.to(player.id).emit('increaseShield', -bullets[i].bulletSize);


      // can shift into when the player dies
      let isCurrentPlayerWinning = checkIfCurrentPlayerIsWinning(player.id);
      let isCurrentKillerWinning = checkIfCurrentPlayerIsWinning(bullets[i].clientId);
      console.log("Is player winning" + isCurrentPlayerWinning);
      console.log("Is killer winning" + isCurrentKillerWinning);

      if (player.shield <= 0) {
        updatePlayerScore(bullets[i].clientId, isCurrentPlayerWinning, player.score);
        player.score = 0;
        io.to(player.id).emit('playExplosion');
        io.to(bullets[i].clientId).emit('playExplosion');


        let killer = getKiller(bullets[i].clientId);


        let playerKill = {
          killer: killer.name,
          killerAngle: killer.angle,
          killerWinner: isCurrentKillerWinning,
          deather: player.name,
          deatherAngle: player.angle,
          deatherWinner: isCurrentPlayerWinning
        };
        io.sockets.emit('killfeed', playerKill);
      }
      io.to(bullets[i].clientId).emit('hitMarker', player);
      bullets.splice(i, 1);
    }
  }
}


function checkPlayerCollision(player) {

  for (const otherPlayer of players) {
    if (otherPlayer !== player && Math.abs(player.x-otherPlayer.x) + Math.abs(player.y-otherPlayer.y) < 42) {
       if (!isPlayerDead(player) && !isPlayerDead(otherPlayer)) {
        killPlayer(player);
        killPlayer(otherPlayer);
        break;
      }
    }
  }
}

function isPlayerDead(player) {
  return player.lastDeath !== null && player.lastDeath > new Date();
}


function updatePlayerScore(id, isCurrentPlayerWinning, score) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id == id) {
      console.log("Increasing players score!!!");
      players[i].score++;
      if (isCurrentPlayerWinning) {
        let scoreIncrease = score * 100;
        scoreIncrease = scoreIncrease == 0 ? 100 : scoreIncrease;
        io.to(id).emit('increaseShield', scoreIncrease);
        players[i].shield += scoreIncrease;
      } else {
        let scoreIncrease = score * 10;
        scoreIncrease = scoreIncrease == 0 ? 50 : scoreIncrease;
        io.to(id).emit('increaseShield', scoreIncrease);
        players[i].shield += scoreIncrease;
      }

      if (players[i].shield > config.settings.MAX_SHIELD) {
        players[i].shield = config.settings.MAX_SHIELD;
      }
    }
  }
}

function checkIfCurrentPlayerIsWinning(id) {

  if (leaderboard.length > 0) {
    if (id == leaderboard[0].id) {
      return true;
    }
  }
  return false;
}

function setupPlayerLastShot(socket) {
  let playerLastShot = {
    id: socket.id,
    date: Date.now()
  }
  playersLastShot.push(playerLastShot);
}

function processPlayerShooting(player, socket) {
  for (let i = 0; i < playersLastShot.length; i++) {
    if (playersLastShot[i].id == socket.id) {
      let previousShot = playersLastShot[i].date;
      let timeSinceLastShot = Date.now() - previousShot;
      if (timeSinceLastShot > 200) {
        playersLastShot[i].date = Date.now();
        io.to(socket.id).emit('processShotSound');
        lastBulletId = lastBulletId + 1;
        let bullet = {
          x: player.x,
          y: player.y,
          angle: player.angle,
          id: lastBulletId,
          clientId: player.id,
          bulletSize: 100
        };
        bullets.push(bullet);
      }
    }
  }
}

function updateLeaderboard() {
  for (let i = 0; i < leaderboard.length; i++) {
    for (let j = 0; j < players.length; j++) {
      if (leaderboard[i].id == players[j].id) {
        leaderboard[i].score = players[j].score;
      }
    }
  }

  leaderboard.sort(function (a, b) {
    return a.score < b.score;
  });
}

function addNewPlayerToLeaderboard(playerData) {
  let player = {
    id: playerData.id,
    name: playerData.name,
    score: playerData.score,
    lastDeath: null
  };

  leaderboard.push(player);
}
