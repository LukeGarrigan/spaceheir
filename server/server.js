let config = require('../configs/defaults.js');


let compression = require('compression');
let express = require('express');
let setupFood = require('./setupFood.js');
let setupAsteroids = require('./setupAsteroids.js');
let asteroidService = require('./services/asteroidService.js');
let playerService = require('./services/playerService.js');
let leaderboardService = require('./services/leaderboardService.js');
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
let lastBulletId = 0;
let lastXpGemId = 0;
let asteroids = [];
let xpGems = [];
let lastLog = 0;

foods = setupFood();
asteroids = setupAsteroids();
setInterval(broadcastGameStateToPlayers, 2);
setInterval(updateGame, 14);

module.exports = {
  players,
  processPlayerShooting,
  bullets,
  foods,
  asteroids,
  io
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

  playerService.setupPlayerLastShot(socket);

});


function broadcastGameStateToPlayers() {


  io.sockets.emit('heartbeat', players);

  if (bullets.length > 0) {
    io.sockets.emit('bullets', bullets);
  }

}

function updateGame() {
  leaderboardService.emitLeaderboard(io);
  //logServerInfo();
  for (let player of players) {
    updatePlayer(player);
  }

  updateBulletPositions();

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
  }
  lastLog++;

}


function updateBulletPositions() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let speed = 20;
    bullets[i].x += (bullets[i].bulletSpeed * config.settings.BULLET_SPEED_MULTIPLIER + speed) * Math.cos(bullets[i].angle);
    bullets[i].y += (bullets[i].bulletSpeed * config.settings.BULLET_SPEED_MULTIPLIER + speed) * Math.sin(bullets[i].angle);
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
  resetPlayerStats(player);


  const timeOutInSeconds = 5;
  player.lastDeath = new Date();
  player.lastDeath.setSeconds(player.lastDeath.getSeconds() + timeOutInSeconds);

  leaderboardService.updateLeaderboard(players);
  io.to(player.id).emit('respawn-start', timeOutInSeconds);
  io.to(player.id).emit('playExplosion');
}


function resetPlayerStats(player) {
  if (config.settings.DEBUG_MODE) {
    player.x = config.settings.DEBUG_MODE_X;
    player.y = config.settings.DEBUG_MODE_Y;
  } else {
    player.x = Math.floor(Math.random() * (config.settings.PLAYAREA_WIDTH)) + 1;
    player.y = Math.floor(Math.random() * (config.settings.PLAYAREA_HEIGHT)) + 1;
  }

  player.shield = config.settings.MAX_SHIELD / 2;
  player.score = 0;
  player.additionalSpeed = 0;
  player.damage = 0;
  player.regen = 0;
  player.bulletSpeed = 0;

}


function updatePlayerShield(player) {
  if (player.shield < 0) {
    killPlayer(player);
  } else  {
    constrainShield(player);
  }

}

function constrainShield(player) {
  if (player.shield > config.settings.MAX_SHIELD) {
    player.shield = config.settings.MAX_SHIELD;
  }

}

function updatePlayer(player) {


  if (player.lastDeath !== null) {
    const currentDate = new Date();
    if (player.lastDeath > currentDate) {
      return
    } else {
      io.to(player.id).emit('respawn-end');
      player.lastDeath = null
    }
  }

  playerService.movePlayer(player);
  playerService.constrain(player);
  playerService.updatePlayerEatingFood(player, foods, io);
  updatePlayerGettingShot(player);
  updatePlayerEatingGem(player);
  asteroidService.processPlayerHittingAsteroid(player, asteroids);
  updatePlayerShield(player);
}


function updatePlayerEatingGem(player) {
  for (let i = xpGems.length - 1; i >= 0; i--) {
    if (Math.abs(xpGems[i].x - player.x) + Math.abs(xpGems[i].y - player.y) < 21 + 15) {
      player.xp += 200;

      io.sockets.emit("removeXpGem", xpGems[i].id);
      xpGems.splice(i, 1);

      playerService.processPlayerLevelingUp(player, io);
    }
  }
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

function processPlayerDying(i, isDeadPlayerWinning, player, isCurrentKillerWinning) {
  updatePlayerScore(bullets[i].clientId, isDeadPlayerWinning, player.score);
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
    deatherWinner: isDeadPlayerWinning
  };
  io.sockets.emit('killfeed', playerKill);
}


function processPlayerGettingShotByAnotherPlayer(player, i) {
  if (player.id !== bullets[i].clientId) {
    if (hasBulletHit(i, player, 37)) {
      removeBulletFromGame(i);
      doDamage(player, getShooter(bullets[i].clientId));
      let isCurrentPlayerWinning = leaderboardService.checkIfCurrentPlayerIsWinning(player.id);
      let isCurrentKillerWinning = leaderboardService.checkIfCurrentPlayerIsWinning(bullets[i].clientId);

      if (player.shield <= 0) {
        processPlayerDying(i, isCurrentPlayerWinning, player, isCurrentKillerWinning);
      }

      io.to(bullets[i].clientId).emit('hitMarker', player);
      bullets.splice(i, 1);
    }


  }
}

function hasBulletHit(i, playerOrAsteroid, radius) {
  return Math.abs(bullets[i].x - playerOrAsteroid.x) + Math.abs(bullets[i].y - playerOrAsteroid.y) < radius;
}


function doDamage(player, shooter) {
  player.shield -= config.settings.BASE_DAMAGE + shooter.damage * config.settings.DAMAGE_MULTIPLIER;
}


function hasBulletHitAnAsteroid(i, clientId) {
  for (let asteroid of asteroids) {
    if (hasBulletHit(i, asteroid, asteroid.r / 2)) {

      let shooter = getShooter(clientId);
      asteroid.health -= 10 + shooter.damage * config.settings.DAMAGE_MULTIPLIER / 2;
      if (asteroid.health <= 0) {
        createXpGem(asteroid);
        asteroidService.respawnAsteroid(asteroid, io);
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


function updateKillersShield(isDeadPlayerWinning, score, killerPlayer) {
  if (isDeadPlayerWinning) {
    let scoreIncrease = score * 100;
    scoreIncrease = scoreIncrease === 0 ? 100 : scoreIncrease;
    killerPlayer.shield += scoreIncrease;
  } else {
    let scoreIncrease = score * 10;
    scoreIncrease = scoreIncrease === 0 ? 50 : scoreIncrease;
    killerPlayer.shield += scoreIncrease;
  }
}

function updatePlayerScore(id, isDeadPlayerWinning, score) {
  for (let i = 0; i < players.length; i++) {
    let killerPlayer = players[i];
    if (killerPlayer.id === id) {
      killerPlayer.score++;
      killerPlayer.xp += 2000;
      playerService.processPlayerLevelingUp(killerPlayer, io);
      updateKillersShield(isDeadPlayerWinning, score, killerPlayer);
      constrainShield(killerPlayer);
    }
  }
}


function processPlayerShooting(player, socket) {
    if (playerService.canPlayerShoot(socket)) {
      io.to(socket.id).emit('processShotSound');
      lastBulletId = lastBulletId + 1;
      let bullet = {
        x: player.x,
        y: player.y,
        angle: player.angle,
        id: lastBulletId,
        clientId: player.id,
        bulletSize: 100,
        bulletSpeed: player.bulletSpeed
      };
      bullets.push(bullet);
    }
}



