let leaderboard = [];

function checkIfCurrentPlayerIsWinning(id) {

  if (leaderboard.length > 0) {
    if (id === leaderboard[0].id) {
      return true;
    }
  }
  return false;
}

function updateLeaderboard(players) {
  for (let i = 0; i < leaderboard.length; i++) {
    for (let j = 0; j < players.length; j++) {
      if (leaderboard[i].id === players[j].id) {
        leaderboard[i].score = players[j].score;
        leaderboard[i].lvl = players[j].lvl;
      }
    }
  }

  leaderboard.sort(function (a, b) {
    return a.score < b.score;
  });
}



function emitLeaderboard(io) {
  io.sockets.emit('leaderboard', leaderboard);
}



function updatePlayerOnLeaderboard(player) {
  for (let leader of leaderboard) {
    if (leader.id === player.id) {
      leader.lvl = player.lvl;
      break;
    }
  }
}


function addNewPlayerToLeaderboard(playerData) {
  let player = {
    id: playerData.id,
    name: playerData.name,
    score: playerData.score,
    lvl: playerData.lvl,
    lastDeath: null
  };

  leaderboard.push(player);
}


function removePlayerFromLeaderboard(socketId) {
  for (let i = leaderboard.length - 1; i >= 0; i--) {
    if (leaderboard[i].id === socketId) {
      leaderboard.splice(i, 1);
    }
  }
}


module.exports = {
  checkIfCurrentPlayerIsWinning,
  updateLeaderboard,
  emitLeaderboard,
  updatePlayerOnLeaderboard,
  addNewPlayerToLeaderboard,
  removePlayerFromLeaderboard
};
