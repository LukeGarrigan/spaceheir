const { players } = require('../server');

module.exports = function({ socket }, direction) {
  for (let i = 0; i < players.length; i++) {
    if (socket.id === players[i].id) {
      if (direction === "isMoving") {
        players[i].isMoving = false;
      }
    }
  }
}
