const { players } = require('../server');

module.exports = function({ socket }, angle) {
  for (let i = 0; i < players.length; i++) {
    if (socket.id == players[i].id) {
      players[i].angle = angle;
    }
  }
}
