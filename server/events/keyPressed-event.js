const { players } = require('../server');

module.exports = function({ socket }, direction) {
  for (let i = 0; i < players.length; i++) {
    if (socket.id === players[i].id) {
      if (direction === "up") {
        players[i].isUp = true;
      } else if (direction === "spacebar") {
        players[i].isBoosting = true;
      }
    }
  }
};