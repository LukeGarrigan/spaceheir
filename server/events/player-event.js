const { players, addNewPlayerToLeaderboard } = require('../server');
const config = require('../../configs/defaults');


module.exports = function({ socket }, playerData) {



  if(!validName(playerData)) {
    socket.emit("invalidUsername", playerData.name);
    return;
  }

  if (playerAlreadyExists(socket)) return;

  playerData.velocity = 1;

  playerData.id = socket.id;
  playerData.shield = config.settings.BASE_SHIELD;
  playerData.isMoving = false;
  playerData.isBoosting = false;
  playerData.r = 21;
  playerData.score = 0;

  playerData.yVelocity = 0;
  playerData.xVelocity = 0;
  playerData.additionalSpeed = 0;
  playerData.xp = 625;
  playerData.lvl = 1;
  playerData.speed = 0;
  playerData.damage = 0;
  playerData.regen = 0;
  playerData.bulletSpeed = 0;
  playerData.establishedLevel = 1;

  if (config.settings.DEBUG_MODE) {
    playerData.x = 1000;
    playerData.y = 1000;
  }
  players.push(playerData);
  addNewPlayerToLeaderboard(playerData);
};

function playerAlreadyExists(socket) {
  for (const player of players) {
    if (player.id === socket.id) {
      return true;
    }
  }
  return false;
}



function validName(playerData) {
  let playersName = playerData.name.substring(0, 15);
  playerData.name = playersName.replace(/[^\x00-\x7F]/g, "");
  for (const player of players) {
    if (player.name === playerData.name) {
      return false;
    }
  }
  return true;
}