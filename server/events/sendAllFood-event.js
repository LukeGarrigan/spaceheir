const {foods} = require('../server');

module.exports = function ({socket}) {
  socket.emit('foods', foods);
};
