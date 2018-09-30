const { players, leaderboard } = require('../server');

module.exports = function({ socket }) {
  console.log("Player disconnected");

  for (let i = players.length - 1; i >= 0; i--) {
    if (players[i].id == socket.id) {
      players.splice(i, 1);
    }
  }

  for (let i = leaderboard.length - 1; i >= 0; i--) {
    if (leaderboard[i].id == socket.id) {
      leaderboard.splice(i, 1);
    }
  }
  socket.broadcast.emit('playerDisconnected', socket.id);
}
