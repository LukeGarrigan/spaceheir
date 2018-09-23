import socket from './socket.js';
import BasicTextPopup from './Popup/BasicTextPopup.js';
import DecreaseShield from './Popup/DecreaseShield.js';
import IncreaseShield from './Popup/IncreaseShield.js';
import Bullet from './Bullet/Bullet.js';
import Food from './Food/Food.js';
import HitMarker from './HitMarker/HitMarker.js';

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

export function displayIncreasedShieldMessage(data, popups, player) {
  popups.push(data < 0
    ? new DecreaseShield(data, player.x, player.y - player.r)
    : new IncreaseShield(data, player.x, player.y - player.r)
  )
}

export function updateOtherPlayers(data, player, otherPlayers) {
  for (let i = 0; i < data.length; i++) {
    let exists = false;

    if (data[i].id == socket.id) {
      player.pos.x = data[i].x;
      player.pos.y = data[i].y;
      player.r = data[i].r;
      player.name = data[i].name;
      player.shield = data[i].shield;
      player.score = data[i].score;
      continue;
    }
    for (let j = 0; j < otherPlayers.length; j++) {
      if (data[i].id == otherPlayers[j].id) {
        otherPlayers[j] = data[i];
        exists = true;
      }
    }

    if (!exists) {
      otherPlayers.push(data[i]);
    }
  }
}

export function updateBullets(data, bulletIds, bullets) {
  for (let i = 0; i < data.length; i++) {
    let exists = false;
    for (let j = 0; j < bulletIds.length; j++) {
      if (data[i].id == bulletIds[j]) {
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

export function updateFoods(data, food) {
  for (let i = 0; i < data.length; i++) {
    let exists = false;
    for (let j = 0; j < food.length; j++) {
      if (data[i].id == food[j].id) {
        exists = true;
        if (data[i].x !== food[j].x || data[i].y !== food[j].y) {
          food[j].x = data[i].x;
          food[j].y = data[i].y;
        }
      }
    }
    if (!exists) {
      let aFood = new Food(data[i].x, data[i].y, data[i].r, data[i].id);
      food.push(aFood);
    }
  }
}

export function removeBullet(id, bullets) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].id == id) {
      bullets.splice(i, 1);
      break;
    }
  }
}

export function processHitmarker(player, hitMarkerImage, hitMarkerSound) {
  hitMarker = new HitMarker(player, hitMarkerImage);
  hitMarkerSound.play();
  return hitMarker;
}
