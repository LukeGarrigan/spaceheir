let express = require('express');
let app = express();


let server = app.listen(4000);

app.use(express.static('public'));

console.log("Server is now running");


let socket = require('socket.io');

let io = socket(server);



io.sockets.on('connection', function newConnection(socket){
    console.log("new connection "+ socket.id);
    socket.on('player', function playerMessage(playerData) {
      playerData.id = socket.id;
      socket.broadcast.emit('player', playerData);
    });

    socket.on('bullet', function(player) {
      console.log("A bullet was shot");
      socket.broadcast.emit('bullet', player);
    });

    socket.on('disconnect', function (){
      console.log("Player disconnected " + socket.id);
      socket.broadcast.emit('playerDisconnected', socket.id);
    });
});
