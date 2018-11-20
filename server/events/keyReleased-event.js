const { players } = require('../server');

module.exports = function({ socket }, direction) {
  for (let i = 0; i < players.length; i++) {
    if (socket.id === players[i].id) {
      if (direction === "up") {
        players[i].isUp = false;
      } else if (direction === "down") {
        players[i].isDown = false;
      } else if (direction === "left") {
        players[i].isLeft = false;
      } else if (direction === "right") {
        players[i].isRight = false;
      } else if (direction === "spacebar") {

        players[i].isBoosting = false;
      }
    }
  }
}
