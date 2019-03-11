let config = require('../../configs/defaults.js');
let leaderboardService = require('./leaderboardService')


let playersLastShot = [];


function movePlayer(player) {
  if (player.isMoving) {
    speedPlayerUp(player);
  } else {
    slowPlayerDown(player);
  }
}

function speedPlayerUp(player) {
  if (player.velocity < config.BASE_SPEED + player.additionalSpeed * config.SPEED_MULTIPLIER) {
    player.velocity += 0.2;
  }
  player.x += player.velocity * Math.cos(player.angle);
  player.y += player.velocity * Math.sin(player.angle);
}


function slowPlayerDown(player) {
  if (player.velocity > 0.1) {
    player.velocity -= 0.1;
  } else if (player.velocity <= 0) {
    player.velocity = 0;
  }
  player.x += player.velocity * Math.cos(player.angle);
  player.y += player.velocity * Math.sin(player.angle);
}


function constrain(player) {
  if (player.x < -68) {
    player.x = config.PLAYAREA_WIDTH;
  } else if (player.x > config.PLAYAREA_WIDTH) {
    player.x = 0;
  }
  if (player.y < -68) {
    player.y = config.PLAYAREA_HEIGHT;
  } else if (player.y > config.PLAYAREA_HEIGHT) {
    player.y = 0;
  }
}

function updatePlayerEatingFood(player, foods, io) {
  for (let i = 0; i < foods.length; i++) {
    let currentFood = foods[i];
    if (Math.abs(currentFood.x - player.x) + Math.abs(currentFood.y - player.y) < 21 + foods[i].r) {
      playerAteFood(player, currentFood, io);
    }
  }
}


function playerAteFood(player, currentFood, io) {
  if (player.shield < config.MAX_SHIELD) {
    player.shield += currentFood.r + player.regen * config.REGEN_MULTIPLIER;
    io.to(player.id).emit('increaseShield', currentFood.r + player.regen * config.REGEN_MULTIPLIER);
  }
  updateFoodLocation(currentFood);
  let foodArray = [];
  foodArray.push(currentFood);
  io.sockets.emit('foods', foodArray);
}


function updateFoodLocation(currentFood) {
  let foodX = Math.floor(Math.random() * (config.PLAYAREA_WIDTH)) + 1;
  let foodY = Math.floor(Math.random() * (config.PLAYAREA_HEIGHT)) + 1;
  currentFood.x = foodX;
  currentFood.y = foodY;
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


