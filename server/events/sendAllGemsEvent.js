const {xpGems} = require('../server');

module.exports = function ({socket}) {
  socket.emit('createXpGem', xpGems);
};
