import socket from './socket.js';
import BasicTextPopup from './Popup/BasicTextPopup.js';
import IncreaseShield from './Popup/IncreaseShield.js';
import Bullet from './Bullet/Bullet.js';
import Food from './classes/Food.js';
import Asteroid from './Asteroid/Asteroid.js';
import HitMarker from './classes/Hitmarker.js';
import Gem from './classes/Gem.js';
import XpPopup from './Popup/IncreaseXp.js';
import OtherPlayer from './OtherPlayer.js';
import Message from './classes/Message.js';
import Boss from './classes/Boss.js';


export function processRespawn(player, popups, timeOutInSeconds) {
  player.respawning = true;

  for (let i = 0; i < timeOutInSeconds; i++) {
    setTimeout(() => {
      popups.push(new BasicTextPopup(timeOutInSeconds - i, 32, player.x, player.y - player.r));
    }, i * 1000);
  }
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
    player.xp = clientData.xp;
    player.lvl = clientData.lvl;
    player.additionalSpeed = clientData.additionalSpeed;
    player.damage = clientData.damage;
    player.regen = clientData.regen;
    player.bulletSpeed = clientData.bulletSpeed;
  }

  for (let i = 0; i < otherplayersData.length; i++) {

    if (otherPlayers[i]) {

      otherPlayers[i].x = otherplayersData[i].x;
      otherPlayers[i].y = otherplayersData[i].y;
      otherPlayers[i].lastDeath = otherplayersData[i].lastDeath;
      otherPlayers[i].angle = otherplayersData[i].angle;
      otherPlayers[i].shield = otherplayersData[i].shield;
      otherPlayers[i].lvl = otherplayersData[i].lvl;
    } else {
      let x = otherplayersData[i].x;
      let y = otherplayersData[i].y;
      let lastDeath = otherplayersData[i].lastDeath;
      let id = otherplayersData[i].id;
      let name = otherplayersData[i].name;
      let lvl = otherplayersData[i].lvl;
      let angle = otherplayersData[i].angle;


      otherPlayers[i] = new OtherPlayer(x, y, lastDeath, id, name, lvl, angle);
    }

  }
}



export function updateBullets(data, bullets) {
  for (let i = 0; i < data.length; i++) {
    let exists = false;
    for (let j = 0; j < bullets.length; j++) {
      if (data[i].id === bullets[j].id) {
        exists = true;
        bullets[j].x = data[i].x;
        bullets[j].y = data[i].y;
        break;
      }
    }
    if (!exists) {
      let bullet = new Bullet(data[i].x, data[i].y, data[i].id);
      bullets.push(bullet);
    }
  }
}



export function removeBullet(id, bullets) {
  let index = getBullet(id, bullets);
  if (index !== null) {
    bullets.splice(index, 1);
  }
}

function getBullet(id, bullets) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].id === id) {
      return i;
    }
  }
  return null;
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

export function isWithinScreenXAndY(player, toX, toY) {
  const height = Math.floor(window.outerHeight/1.5);
  const width = Math.floor(window.outerWidth/1.5);


  const diffX = player.x - toX;
  const diffY = player.y - toY;


  return !(diffX > width || diffX < -width || diffY > height || diffY < -height);

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

export function updateAsteroids(data, asteroids, asteroidImages) {
  for (let i = 0; i < data.length; i++) {
    let exists = false;

    for (let currentAsteroid of asteroids) {
      if (currentAsteroid.id === data[i].id) {
        currentAsteroid.initialiseExplosion();

        exists = true;
        currentAsteroid.x = data[i].x;
        currentAsteroid.y = data[i].y;
        currentAsteroid.health = data[i].health;
        currentAsteroid.image = asteroidImages[data[i].asteroidIndex];
        currentAsteroid.r = data[i].r;
      }
    }

    if (!exists) {
      let asteroid = new Asteroid(data[i].x, data[i].y, data[i].id, asteroidImages[data[i].asteroidIndex], data[i].r);
      asteroids.push(asteroid);
    }
  }
}

export function createXpGems(gems, gemImage) {
  let createdGems = [];
  for (let i = 0; i < gems.length; i++) {
    let gem = new Gem(gems[i].id, gems[i].x, gems[i].y, gemImage);
    createdGems.push(gem);
  }
  return createdGems;
}

export function removeXpGem(gemId, gems, popups) {

  for (let i = gems.length - 1; i >= 0; i--) {
    if (gems[i].id === gemId) {
      popups.push(new XpPopup(10, gems[i].x, gems[i].y))
      gems.splice(i, 1);
      break;
    }
  }
}

export function updateMessages(serverMessage, messages) {
  if (messages.length > 4) {
    messages.splice(0, 1);
  }
  messages.push(new Message(serverMessage.message, serverMessage.sender));
}

export function updateBosses(updatedBosses, bosses, bossImage) {
  for (let i = 0; i < updatedBosses.length; i++) {
    let exists = false;

    for (let boss of bosses) {
      if (boss.id === updatedBosses[i].id) {
        boss.x = updatedBosses[i].x;
        boss.y = updatedBosses[i].y;
        boss.angle = updatedBosses[i].angle;
        boss.isLaser = updatedBosses[i].isLaser;
        exists = true;
      }
    }

    if (!exists) {
      let boss = new Boss(updatedBosses[i].id, updatedBosses[i].x, updatedBosses[i].y, bossImage, updatedBosses[i].angle);
      bosses.push(boss);
    }
  }
}
