module.exports = function({ socket }, players) {
  for (let i = 0; i < players.length; i++) {
    if (socket.id == players[i].id) {
      players[i].shield -= 75;
    }
  }
}
