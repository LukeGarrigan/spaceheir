export default function(otherPlayers, player, winnerLocation, leaderboard) {
  if (otherPlayers.length > 0) {
    let currentWinner = findCurrentWinner(leaderboard, otherPlayers);
    if (currentWinner && currentWinner.id !== player.id) {
      winnerLocation.drawWinnerLocation(player.x, player.y, currentWinner.x, currentWinner.y);
    }
  }
}


function findCurrentWinner(leaderboard, otherPlayers) {
  let winnerId = leaderboard.leaders[0].id;
  for (const player of otherPlayers) {
    if (player.id === winnerId) {
      return player;
    }
  }
}
