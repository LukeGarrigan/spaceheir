const { players } = require('../server');

module.exports = function({ socket }, direction) {
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
      } else if (direction == "spacebar") {
        players[i].isBoosting = true;
      }
    }
  }
};