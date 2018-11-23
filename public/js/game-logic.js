import socket from './socket.js';
import BasicTextPopup from './Popup/BasicTextPopup.js';
import IncreaseShield from './Popup/IncreaseShield.js';
import Bullet from './Bullet/Bullet.js';
import Food from './Food/Food.js';
import HitMarker from './Hitmarker/Hitmarker.js';

export function processRespawn(player, popups, timeOutInSeconds) {
  player.respawning = true;

  for (let i = 0; i < timeOutInSeconds; i++) {
    setTimeout(() => {
      popups.push(new BasicTextPopup(timeOutInSeconds - i, 32, player.x, player.y - player.r));
    }, i * 1000);
  }
}

export function emitPlayersBullets(bullets) {
  let myBullets = [];
  for (let i = 0; i < bullets.length; i++) {
    if (bullets[i].shooterId === socket.id) {
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
    if (otherPlayers[i].id === socketId) {
      otherPlayers.splice(i, 1);
    }
  }
}

export function displayIncreasedShieldMessage(data, popups, player) {
  if (data > 0) {
    popups.push(new IncreaseShield(data, player.x, player.y - player.r));
  }
}

export function updateOtherPlayers(data, player, otherPlayers) {
  const clientData = data.find(p => p.id === socket.id);
  const otherplayersData = data.filter(p => p.id !== socket.id);

  if (clientData) {
    player.pos.x = clientData.x;
    player.pos.y = clientData.y;
    player.r = clientData.r;
    player.name = clientData.name;
    player.shield = clientData.shield;
    player.score = clientData.score;
  }

  for (let i = 0; i < otherplayersData.length; i++) {
    otherPlayers[i] = otherplayersData[i];
  }
}

export function updateBullets(data, bulletIds, bullets) {
  for (let i = 0; i < data.length; i++) {
    let exists = false;
    for (let j = 0; j < bulletIds.length; j++) {
      if (data[i].id === bulletIds[j]) {
        exists = true;
        break;
      }
    }

    if (!exists) {
      let bullet = new Bullet(data[i].x, data[i].y, data[i].angle, data[i].clientId, data[i].id, data[i].bulletSize);
      bulletIds.push(data[i].id);
      bullets.push(bullet);
    }
  }
}

export function updateFoods(data, food, foodImage) {
  for (let i = 0; i < data.length; i++) {
    let exists = false;
    for (let j = 0; j < food.length; j++) {
      if (data[i].id === food[j].id) {
        exists = true;

        if (food[j].startX !== data[i].x || food[j].startY !== data[i].y ) {
          food[j].x = data[i].x;
          food[j].y = data[i].y;
          food[j].reset();
        }
      }
    }
    if (!exists) {
      let aFood = new Food(data[i].x, data[i].y, data[i].r, data[i].id, foodImage);
      food.push(aFood);
    }
  }
}

export function removeBullet(id, bullets) {
  let index = getBullet(id, bullets);
  bullets.splice(index, 1);
}

function getBullet(id, bullets) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].id === id) {
      return i;
    }
  }
}

export function processHitmarker(player, hitMarkerImage, hitMarkerSound, isMuted) {
  if (!isMuted) {
    hitMarkerSound.play();
  }
  return new HitMarker(player, hitMarkerImage);
}

export function processKillFeedAddition(kill, killfeed) {
  killfeed.addKill(kill.killer, kill.deather, kill.killerWinner, kill.deatherWinner, kill.killerAngle, kill.deatherAngle);
}


export function isWithinScreen(player, to) {
  const height = Math.floor(window.outerHeight/2);
  const width = Math.floor(window.outerWidth/2);

  const diffX = player.x - to.x;
  const diffY = player.y - to.y;
  return !(diffX > width || diffX < -width || diffY > height || diffY < -height);


}
