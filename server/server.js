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
let lastXpGemId = 0;
let asteroids = [];
let xpGems = [];
let lastLog = 0;


setupFood();
setupAsteroids();
setInterval(broadcastGameStateToPlayers, 14);

module.exports = {
  players,
  addNewPlayerToLeaderboard,
  processPlayerShooting,
  leaderboard,
  bullets
};

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
  socket.emit('asteroids', asteroids);
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

function setupAsteroids() {

  for (let i = 0; i < config.settings.NUM_ASTEROIDS; i++) {
    let asteroidX = Math.floor(Math.random() * (config.settings.PLAYAREA_WIDTH)) + 1;
    let asteroidY = Math.floor(Math.random() * (config.settings.PLAYAREA_HEIGHT)) + 1;
    let asteroidIndex = Math.floor(Math.random() * config.settings.NUM_ASTEROID_IMAGES);
    let asteroidRadius = Math.floor(Math.random() * 300) + 50;

    let asteroid = {
      x: asteroidX,
      y: asteroidY,
      id: i,
      health: asteroidRadius * 2,
      asteroidIndex: asteroidIndex,
      r: asteroidRadius
    };

    asteroids.push(asteroid);

  }
}


function broadcastGameStateToPlayers() {
  logServerInfo();

  for (let player of players) {
    updatePlayerPosition(player);
  }

  updateBulletPositions();


  io.sockets.emit('leaderboard', leaderboard);
  io.sockets.emit('heartbeat', players);

  if (bullets.length > 0) {
    io.sockets.emit('bullets', bullets);
  }

}

function logServerInfo() {

  if (config.settings.SERVER_LOGGING && lastLog % 300 === 0) {
    console.log("*****************************");
    console.log("players " + players.length);
    console.log("foods " + foods.length);
    console.log("xp gems " + xpGems.length);
    console.log("asteroids  " + asteroids.length);
    console.log("bullets  " + bullets.length);
    console.log("players last shot " + playersLastShot.length);
    console.log("leaderboard " + leaderboard.length);
  }
  lastLog++;

}


function updateBulletPositions() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let speed = 20;
    bullets[i].x += speed * Math.cos(bullets[i].angle);
    bullets[i].y += speed * Math.sin(bullets[i].angle);
    bullets[i].bulletSize--;


    if (hasBulletHitAnAsteroid(i, bullets[i].clientId)) {
      removeBulletFromGame(i);
      bullets.splice(i, 1);
    } else if (bullets[i].bulletSize <= 1) {
      removeBulletFromGame(i);
      bullets.splice(i, 1);
    }
  }
}


function killPlayer(player) {
  if (config.settings.DEBUG_MODE) {
    player.x = config.settings.DEBUG_MODE_X;
    player.y = config.settings.DEBUG_MODE_Y;
  } else {
    player.x = Math.floor(Math.random() * (config.settings.PLAYAREA_WIDTH)) + 1;
    player.y = Math.floor(Math.random() * (config.settings.PLAYAREA_HEIGHT)) + 1;
  }

  player.shield = 100;

  player.score = 0;
  player.additionalSpeed = 0;
  player.damage = 0;
  player.regen = 0;

  const timeOutInSeconds = 5;
  player.lastDeath = new Date();
  player.lastDeath.setSeconds(player.lastDeath.getSeconds() + timeOutInSeconds)

  updateLeaderboard();
  io.sockets.emit('heartbeat', players);
  io.to(player.id).emit('respawn-start', timeOutInSeconds)
  io.to(player.id).emit('playExplosion');
}


function processPlayerHittingAsteroid(player) {
  for (let asteroid of asteroids) {
    if (Math.abs(asteroid.x - player.x) + Math.abs(asteroid.y - player.y) < asteroid.r / 2) {
      player.shield -= 1;
    }
  }
}

function updatePlayerPosition(player) {
  if (player.lastDeath !== null) {
    const currentDate = new Date();
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
  movePlayer(player);

  // constrain - so moving to the edge of the screen
  constrain(player);
  updatePlayerEatingFood(player);
  updatePlayerGettingShot(player);
  updatePlayerEatingGem(player);
  processPlayerHittingAsteroid(player);
}


function movePlayer(player) {
  if (player.isMoving) {
    if (player.velocity < config.settings.BASE_SPEED + player.additionalSpeed * config.settings.SPEED_MULTIPLIER) {
      player.velocity += 0.2;
    }
    player.x += player.velocity * Math.cos(player.angle);
    player.y += player.velocity * Math.sin(player.angle);
  } else {
    if (player.velocity > 0.1) {
      player.velocity -= 0.1;
    } else if (player.velocity <= 0) {
      player.velocity = 0;
    }
    player.x += player.velocity * Math.cos(player.angle);
    player.y += player.velocity * Math.sin(player.angle);
  }
}

function constrain(player) {
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
}

function updatePlayerEatingFood(player) {
  for (let i = 0; i < foods.length; i++) {
    if (Math.abs(foods[i].x - player.x) + Math.abs(foods[i].y - player.y) < 21 + foods[i].r) {
      if (player.shield < config.settings.MAX_SHIELD) {
        player.shield += foods[i].r + player.regen * config.settings.REGEN_MULTIPLIER;
        io.to(player.id).emit('increaseShield', foods[i].r + player.regen * config.settings.REGEN_MULTIPLIER);
      }
      let foodX = Math.floor(Math.random() * (config.settings.PLAYAREA_WIDTH)) + 1;
      let foodY = Math.floor(Math.random() * (config.settings.PLAYAREA_HEIGHT)) + 1;
      foods[i].x = foodX;
      foods[i].y = foodY;

      let foodArray = [];
      foodArray.push(foods[i]);
      io.sockets.emit('foods', foodArray);
    }
  }
}

function updatePlayerEatingGem(player) {
  for (let i = xpGems.length - 1; i >= 0; i--) {
    if (Math.abs(xpGems[i].x - player.x) + Math.abs(xpGems[i].y - player.y) < 21 + 15) {
      player.xp += 200;

      io.sockets.emit("removeXpGem", xpGems[i].id);
      xpGems.splice(i, 1);

      checkIfPlayerHasLeveledUp(player);
    }

  }
}

function checkIfPlayerHasLeveledUp(player) {
  if (playerHasLeveledUp(player)) {
    player.lvl++;
    updatePlayerOnLeaderboard(player);
    io.to(player.id).emit('leveledUp');
  }
}

function updatePlayerOnLeaderboard(player) {
  for (let leader of leaderboard) {
    if (leader.id === player.id) {
      leader.lvl = player.lvl;
      break;
    }
  }
}

function playerHasLeveledUp(player) {
  let currentLevel = Math.floor(0.04 * Math.sqrt(player.xp));
  return currentLevel > player.lvl;
}

function updatePlayerGettingShot(player) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    processPlayerGettingShotByAnotherPlayer(player, i);
  }
}

function getShooter(clientId) {
  for (let player of players) {
    if (player.id === clientId) {
      return player;
    }
  }
}

function removeBulletFromGame(i) {
  io.sockets.emit('bulletHit', bullets[i].id);
}

function processPlayerDying(i, isCurrentPlayerWinning, player, isCurrentKillerWinning) {
  updatePlayerScore(bullets[i].clientId, isCurrentPlayerWinning, player.score);
  player.score = 0;
  player.xp = 625;
  player.lvl = 1;
  player.establishedLevel = 1;
  io.to(player.id).emit('playExplosion');
  io.to(bullets[i].clientId).emit('playExplosion');


  let killer = getShooter(bullets[i].clientId);


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


function processPlayerGettingShotByAnotherPlayer(player, i) {
  if (player.id !== bullets[i].clientId) {
    if (hasBulletHit(i, player, 37)) {
      removeBulletFromGame(i);
      let shooter = getShooter(bullets[i].clientId);
      player.shield -= config.settings.BASE_DAMAGE + shooter.damage * config.settings.DAMAGE_MULTIPLIER;
      io.to(player.id).emit('increaseShield', -bullets[i].bulletSize);


      // can shift into when the player dies
      let isCurrentPlayerWinning = checkIfCurrentPlayerIsWinning(player.id);
      let isCurrentKillerWinning = checkIfCurrentPlayerIsWinning(bullets[i].clientId);
      console.log("Is player winning" + isCurrentPlayerWinning);
      console.log("Is killer winning" + isCurrentKillerWinning);

      if (player.shield <= 0) {
        processPlayerDying(i, isCurrentPlayerWinning, player, isCurrentKillerWinning);
      }

      io.to(bullets[i].clientId).emit('hitMarker', player);
      bullets.splice(i, 1);
    }


  }
}


function hasBulletHitAnAsteroid(i, clientId) {
  for (let asteroid of asteroids) {
    if (hasBulletHit(i, asteroid, asteroid.r / 2)) {

      let shooter = getShooter(clientId);
      asteroid.health -= 10 + shooter.damage * config.settings.DAMAGE_MULTIPLIER / 2;
      if (asteroid.health <= 0) {
        createXpGem(asteroid);
        respawnAsteroid(asteroid);
      }
      return true;
    }


  }
  return false;
}

function createXpGem(asteroid) {
  let sizeOfAsteroid = asteroid.r;
  let numberOfGems = Math.floor(sizeOfAsteroid / 30);
  let asteroidsGems = [];

  for (let i = 0; i < numberOfGems; i++) {
    let xpGem = {
      id: lastXpGemId++,
      x: asteroid.x + Math.random() * (sizeOfAsteroid / 2) - (sizeOfAsteroid / 2),
      y: asteroid.y + Math.random() * (sizeOfAsteroid / 2) - (sizeOfAsteroid / 2)
    };

    asteroidsGems.push(xpGem);
    xpGems.push(xpGem);
  }


  io.sockets.emit("createXpGem", asteroidsGems);
}


function respawnAsteroid(asteroid) {
  let asteroidX = Math.floor(Math.random() * (config.settings.PLAYAREA_WIDTH)) + 1;
  let asteroidY = Math.floor(Math.random() * (config.settings.PLAYAREA_HEIGHT)) + 1;
  let asteroidIndex = Math.floor(Math.random() * config.settings.NUM_ASTEROID_IMAGES);
  let asteroidRadius = Math.floor(Math.random() * 300) + 50;


  asteroid.x = asteroidX;
  asteroid.y = asteroidY;
  asteroid.asteroidIndex = asteroidIndex;
  asteroid.r = asteroidRadius;
  asteroid.health = asteroidRadius * 2;

  let tempAsteroids = [];

  tempAsteroids.push(asteroid);

  io.sockets.emit("asteroids", tempAsteroids);
}


function hasBulletHit(i, playerOrAsteroid, radius) {
  return Math.abs(bullets[i].x - playerOrAsteroid.x) + Math.abs(bullets[i].y - playerOrAsteroid.y) < radius;
}


function updatePlayerScore(id, isCurrentPlayerWinning, score) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id == id) {
      console.log("Increasing players score!!!");
      players[i].score++;
      players[i].xp += 2000;
      checkIfPlayerHasLeveledUp(players[i]);
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
    if (id === leaderboard[0].id) {
      return true;
    }
  }
  return false;
}

function setupPlayerLastShot(socket) {
  let playerLastShot = {
    id: socket.id,
    date: Date.now()
  };
  playersLastShot.push(playerLastShot);
}

function processPlayerShooting(player, socket) {
  for (let i = 0; i < playersLastShot.length; i++) {
    if (canPlayerShoot(i, socket)) {
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


function canPlayerShoot(i, socket) {
  if (playersLastShot[i].id === socket.id) {
    let previousShot = playersLastShot[i].date;
    let timeSinceLastShot = Date.now() - previousShot;
    return timeSinceLastShot > 200;
  }
  return false;
}

function updateLeaderboard() {
  for (let i = 0; i < leaderboard.length; i++) {
    for (let j = 0; j < players.length; j++) {
      if (leaderboard[i].id === players[j].id) {
        leaderboard[i].score = players[j].score;
        leaderboard[i].lvl  = players[j].lvl;
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
    lvl: playerData.lvl,
    lastDeath: null
  };

  leaderboard.push(player);
}
