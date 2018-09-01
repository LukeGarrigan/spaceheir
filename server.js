let express = require('express');
let app = express();


let server = app.listen(4000);

app.use(express.static('public'));

console.log("Server is now running");


let socket = require('socket.io');

let io = socket(server);


let playersLastShot = [];

// playerId
// time
//

io.sockets.on('connection', function newConnection(socket){
    console.log("new connection "+ socket.id);
    let playerLastShot = {
      id : socket.id,
      date : Date.now()
    }
    playersLastShot.push(playerLastShot);

    socket.on('player', function playerMessage(playerData) {
      playerData.id = socket.id;
      socket.broadcast.emit('player', playerData);

    });

    socket.on('bullet', function(player) {
      for (let i = 0; i < playersLastShot.length; i++) {
        if (playersLastShot[i].id == socket.id) {
          let previousShot = playersLastShot[i].date;
          let timeSinceLastShot = Date.now()-previousShot;
          console.log(timeSinceLastShot);
          if (timeSinceLastShot > 200) {
            console.log("Has been longer..");
            socket.broadcast.emit('bullet', player);
          }
        }

      }


      // let playerPosition = {
      //   x: player.pos.x,
      //   y: player.pos.y,
      //   angle: player.radians
      // }



    });

    socket.on('disconnect', function (){
      console.log("Player disconnected " + socket.id);
      socket.broadcast.emit('playerDisconnected', socket.id);
    });
});
