/**
 * @typedef {{ x: number, y: number }} Position
 */

import socket from './socket.js';
import BasicTextPopup from './Popup/BasicTextPopup.js';
import DecreaseShield from './Popup/DecreaseShield.js';
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
  hitMarkerSound.play();
  return new HitMarker(player, hitMarkerImage);
}

export function processKillFeedAddition(kill, killfeed) {
  killfeed.addKill(kill.killer, kill.deather, kill.killerWinner, kill.deatherWinner, kill.killerAngle, kill.deatherAngle);
}

/**
 * Calculates if a game object is inside the window relative to the player (center of the screen)
 *
 * TODO:  Client should only receive data from objects that are near him.
 *        Implement this check in backend instead.
 *
 * @param {Position} player
 * @param {Position} to
 */
export function isWithinScreen(player, to) {
  const height = Math.floor(window.outerHeight / 2 );
  const width = Math.floor(window.outerWidth / 2 );

  const diffX = player.x - to.x;
  const diffY = player.y - to.y;

  if (diffX > width || diffX < -width || diffY > height || diffY < -height) {
    return false;
  }

  return true;
}
