const {players} = require('../server');

module.exports = function ({socket}, direction) {
  for (let i = players.length - 1; i >= 0; i--) {
    if (players[i].id === socket.id && players[i].establishedLevel < players[i].lvl) {
      if (direction === "speed") {
        players[i].additionalSpeed += 1;
        players[i].establishedLevel += 1;
      } else if (direction === "damage") {
        players[i].damage += 50;
        players[i].establishedLevel += 1;
      } else if (direction === "regen") {
        players[i].regen += 10;
        players[i].establishedLevel += 1;
      }
    }
  }

};
