const { players } = require('../server');
const leaderboardService  = require('../services/leaderboardService');
module.exports = function({ socket }) {
  console.log("Player disconnected");

  for (let i = players.length - 1; i >= 0; i--) {
    if (players[i].id === socket.id) {
      players.splice(i, 1);
    }
  }



  leaderboardService.removePlayerFromLeaderboard(socket.id);

  socket.broadcast.emit('playerDisconnected', socket.id);
}
