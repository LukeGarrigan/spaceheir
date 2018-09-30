const { players, processPlayerShooting } = require('../server');

module.exports = function ({ socket }) {
  for (let i = players.length - 1; i >= 0; i--) {
    if (players[i].id == socket.id && players[i].lastDeath === null) {
      processPlayerShooting(players[i], socket);
    }
  }
}
