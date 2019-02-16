let config = require('../../configs/defaults.js');
let leaderboardService = require('./leaderboardService')


let playersLastShot = [];

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


function updatePlayerEatingFood(player, foods, io) {
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


function processPlayerLevelingUp(player,  io) {
  if (hasPlayerLeveledUp(player)) {
    player.lvl++;
    leaderboardService.updatePlayerOnLeaderboard(player);
    io.to(player.id).emit('leveledUp');
  }
}


function hasPlayerLeveledUp(player) {
  let currentLevel = Math.floor(0.04 * Math.sqrt(player.xp));
  return currentLevel > player.lvl;
}


function setupPlayerLastShot(socket) {
  let playerLastShot = {
    id: socket.id,
    date: Date.now()
  };
  playersLastShot.push(playerLastShot);
}

function canPlayerShoot(socket) {
  for (let i = 0; i < playersLastShot.length; i++) {
    if (playersLastShot[i].id === socket.id) {
      let previousShot = playersLastShot[i].date;
      let timeSinceLastShot = Date.now() - previousShot;
      if (timeSinceLastShot > 200) {
        playersLastShot[i].date = Date.now();
        return true;
      } else {
        return false;
      }
    }
  }
  return false;
}


module.exports = {
  movePlayer,
  constrain,
  updatePlayerEatingFood,
  processPlayerLevelingUp,
  setupPlayerLastShot,
  canPlayerShoot
};


