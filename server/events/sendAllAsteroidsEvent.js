const {asteroids} = require('../server');

module.exports = function ({socket}) {
  socket.emit('asteroids', asteroids);
};
