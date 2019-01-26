const { players } = require('../server');

module.exports = function({ socket }, direction) {
  for (let i = players.length - 1; i >= 0; i--) {
    if (players[i].id === socket.id) {
      if (direction === "speed") {

        if (players[i].establishedLevel < players[i].lvl) {
          players[i].additionalSpeed += 1;
          players[i].establishedLevel += 1;
        }
      }
    }
  }

};
