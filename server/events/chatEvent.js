const {io, players} = require('../server');


module.exports = function ({socket}, message) {

  for (let player of players) {
    if (player.id === socket.id) {

      let data = {
        sender: player.name,
        message: message
      };


      if (message.length < 30) {
        io.sockets.emit('chat', data);
      }


    }
  }
};
