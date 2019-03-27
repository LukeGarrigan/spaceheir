let config = require('../configs/defaults.js');


let compression = require('compression');
let express = require('express');
let setupFood = require('./setupFood.js');
let setupAsteroids = require('./setupAsteroids.js');
let asteroidService = require('./services/asteroidService.js');
let playerService = require('./services/playerService.js');
let leaderboardService = require('./services/leaderboardService.js');

let Boss = require('./Boss.js');
let LaserBoss = require('./LaserBoss.js');
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
let foods = setupFood();
let lastBulletId = 0;
let lastXpGemId = 0;
let asteroids = setupAsteroids();
let xpGems = [];
let lastLog = 0;

let bosses = [];


let boss = new LaserBoss();
bosses.push(boss);


setInterval(broadcastGameStateToPlayers, 16);
setInterval(updateGame, 16);

module.exports = {
  players,
  processPlayerShooting,
  bullets,
  foods,
  asteroids,
  io,
  killPlayer
};
let bossService = require('./services/bossService.js');

const events = require('./events/events.js');
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

  io.sockets.emit('boss', bosses);

}

function updateGame() {
  leaderboardService.emitLeaderboard(io);
  //logServerInfo();
  for (let player of players) {
    updatePlayer(player);
  }

  updateBulletPositions();

  for (let boss of bosses) {
    bossService.update(boss, players, asteroids);
    updateBossGettingShot(boss);
  }
}

function updateBossGettingShot(boss) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    if (hasBulletHit(i, boss, 500)) {

      let shooter = getShooter(bullets[i].clientId);
      boss.health -= config.BASE_DAMAGE + shooter.damage * config.DAMAGE_MULTIPLIER;
      removeBulletFromGame(i);


      if (boss.health <= 0) {

        createXpGemsForBoss(boss);
        boss.respawn();
      }
    }
  }
}

function createXpGemsForBoss(boss) {
  let numberOfGems = 140;
  let bossGems = [];

  for (let i = 0; i < numberOfGems; i++) {
    let xpGem = {
      id: lastXpGemId++,
      x: boss.x + Math.random() * (2000 / 2) - (2000 / 2),
      y: boss.y + Math.random() * (2000/ 2) - (2000 / 2)
    };

    bossGems.push(xpGem);
    xpGems.push(xpGem);
  }
  io.sockets.emit("createXpGem", bossGems);
}

function logServerInfo() {

  if (config.SERVER_LOGGING && lastLog % 300 === 0) {
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
    bullets[i].x += (bullets[i].bulletSpeed * config.BULLET_SPEED_MULTIPLIER + speed) * Math.cos(bullets[i].angle);
    bullets[i].y += (bullets[i].bulletSpeed * config.BULLET_SPEED_MULTIPLIER + speed) * Math.sin(bullets[i].angle);
    bullets[i].bulletSize--;


    if (hasBulletHitAnAsteroid(i, bullets[i].clientId)) {
      removeBulletFromGame(i);
    } else if (bullets[i].bulletSize <= 1) {
      removeBulletFromGame(i);
    }
  }
}



function killPlayer(player) {
  playerService.resetPlayerStats(player);

  const timeOutInSeconds = 5;
  player.lastDeath = new Date();
  player.lastDeath.setSeconds(player.lastDeath.getSeconds() + timeOutInSeconds);

  leaderboardService.updateLeaderboard(players);
  io.to(player.id).emit('respawn-start', timeOutInSeconds);
  io.to(player.id).emit('playExplosion');
}




function updatePlayerShield(player) {
  if (player.shield < 0) {
    killPlayer(player);
  } else  {
    constrainShield(player);
  }

}

function constrainShield(player) {
  if (player.shield > config.MAX_SHIELD) {
    player.shield = config.MAX_SHIELD;
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
  bullets.splice(i, 1);
}

function processPlayerDying(i, isDeadPlayerWinning, player, isCurrentKillerWinning) {
  updatePlayerScore(bullets[i].clientId, isDeadPlayerWinning, player.score);
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

      doDamage(player, getShooter(bullets[i].clientId));

      let isCurrentPlayerWinning = leaderboardService.checkIfCurrentPlayerIsWinning(player.id);
      let isCurrentKillerWinning = leaderboardService.checkIfCurrentPlayerIsWinning(bullets[i].clientId);

      if (player.shield <= 0) {
        processPlayerDying(i, isCurrentPlayerWinning, player, isCurrentKillerWinning);
      }

      io.to(bullets[i].clientId).emit('hitMarker', player);
      removeBulletFromGame(i);
    }


  }
}

function hasBulletHit(i, playerOrAsteroid, radius) {
  return Math.abs(bullets[i].x - playerOrAsteroid.x) + Math.abs(bullets[i].y - playerOrAsteroid.y) < radius;
}


function doDamage(player, shooter) {
  player.shield -= config.BASE_DAMAGE + shooter.damage * config.DAMAGE_MULTIPLIER;
}


function hasBulletHitAnAsteroid(i, clientId) {
  for (let asteroid of asteroids) {
    if (hasBulletHit(i, asteroid, asteroid.r / 2)) {

      let shooter = getShooter(clientId);
      asteroid.health -= 10 + shooter.damage * config.DAMAGE_MULTIPLIER / 2;
      if (asteroid.health <= 0) {
        createXpGems(asteroid);
        asteroidService.respawnAsteroid(asteroid, io);
      }
      return true;
    }
  }
  return false;
}

function createXpGems(asteroid) {
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



