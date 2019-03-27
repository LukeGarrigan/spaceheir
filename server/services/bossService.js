let config = require('../../configs/defaults.js');
let asteroidService = require('./asteroidService.js');
let playerService = require('./playerService.js');
const {asteroids, killPlayer, io} = require('../server'); // I don't love that the server calls this but we use a method from the server, need to refactor the server to pull that out into its own service


function update(boss, players) {
  move(boss, players);
  updateShooting(boss);
  processHittingPlayers(boss, players);
}


function move(boss, players) {

  let player = players[0];

  if (player) {
    let speed = 1;

    let distanceX = Math.abs(boss.x - player.x);
    let distanceY = Math.abs(boss.y - player.y);

    if (distanceX + distanceY > 1400) {
      if (boss.x > player.x) {
        boss.x -= speed;
      } else {
        boss.x += speed;
      }

      if (boss.y > player.y) {
        boss.y -= speed;
      } else {
        boss.y += speed;
      }
    }


    setAngle(player, boss);
  }

  processMovingIntoAPlayer(boss, players);
  processMovingIntoAnAsteroid(boss);
}

function setAngle(player, boss) {
  let playerAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
  var dtheta = playerAngle - boss.angle;
  if (dtheta > Math.PI) {
    boss.angle += 2 * Math.PI;
  } else if (dtheta < -Math.PI) {
    boss.angle -= 2 * Math.PI;
  }
  boss.angle += (playerAngle - boss.angle) * 0.05;
}

function processMovingIntoAPlayer(boss, players) {
  for (let player of players) {
    if (playerFlewIntoBoss(player, boss)) {
      killPlayer(player);
    }
  }
}


function processMovingIntoAnAsteroid(boss) {
  for (let asteroid of asteroids) {
    if (playerFlewIntoBoss(asteroid, boss)) {
      asteroidService.respawnAsteroid(asteroid, io);
    }
  }
}


function playerFlewIntoBoss(player, boss) {
  return Math.abs(player.x - boss.x) + Math.abs(player.y - boss.y) < 450;
}


function updateShooting(boss) {
  boss.update();
}


function processHittingPlayers(boss, players) {
  if (boss.isLaser) {
    let destinationX = boss.x + 1500 * Math.cos(boss.angle);
    let destinationY = boss.y + 1500 * Math.sin(boss.angle);

    let endPoint = {
      x: destinationX,
      y: destinationY
    };

    for (let player of players) {
      processHittingPlayer(player, boss, endPoint);
    }
  }
}


function processHittingPlayer(player, boss, endPoint) {
  if (hasBeenHitByLaser(boss, endPoint, player)) {
    player.shield -= 10;

    if (player.shield <= 0) {
      playerService.playerReset(player);
    }
  }
}

function hasBeenHitByLaser(boss, endPoint, player) {

  let distPlayer = dist(boss, player) + dist(player, endPoint);

  let entireDistance = dist(boss, endPoint);

  if (distPlayer > entireDistance && distPlayer < entireDistance + 10) {
    return true;
  } else if (distPlayer < entireDistance && distPlayer > entireDistance - 10) {
    return true;
  }
  return false;

}

function dist(pointA, pointB) {
  let differenceX = pointA.x - pointB.x;
  let differenceY = pointA.y - pointB.y;

  let diffXSquared = differenceX * differenceX;
  let diffYSquared = differenceY * differenceY;


  return Math.sqrt(diffXSquared + diffYSquared);


}

function isWithinLaserX(player, boss, destinationX) {
  return (player.x < boss.x && player.x > destinationX) || (player.x > boss.x && player.x < destinationX);
}

function isWithinLaserY(player, boss, destinationY) {
  return (player.y < boss.y && player.y > destinationY) || (player.y > boss.y && player.y < destinationY);
}


module.exports = {
  move,
  update
};
