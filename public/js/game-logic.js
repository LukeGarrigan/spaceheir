import socket from './socket.js';
import BasicTextPopup from './Popup/BasicTextPopup.js';

export function processRespawn(player, popups, timeOutInSeconds) {
  player.respawning = true;

  for (let i = 0; i < timeOutInSeconds; i++) {
    setTimeout(() => {
      popups.push(new BasicTextPopup(timeOutInSeconds - i, 32));
    }, i * 1000);
  }
}

export function emitPlayersBullets(bullets) {
  let myBullets = [];
  for (let i = 0; i < bullets.length; i++) {
    if (bullets[i].shooterId == socket.id) {
      let bullet = {
        id: bullets[i].id,
        x: bullets[i].pos.x,
        y: bullets[i].pos.y,
        bulletSize: bullets[i].bulletSize
      };
      myBullets.push(bullet);
    }
  }

  socket.emit('playerBullets', myBullets);
}

export function playerDisconnected(socketId, otherPlayers) {
  for (let i = otherPlayers.length - 1; i >= 0; i--) {
    if (otherPlayers[i].id == socketId) {
      otherPlayers.splice(i, 1);
    }
  }
}
