let config = require('../../configs/defaults.js');
const {asteroids} = require('../server');
function update(boss, players) {
  move(boss, players);
  updateShooting(boss);
  hitAsteroid(boss);
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
}

function setAngle(player, boss) {
  let playerAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
  var dtheta = playerAngle - boss.angle;
  if (dtheta > Math.PI) {
    boss.angle += 2 * Math.PI;
  } else if (dtheta < -Math.PI) {
    boss.angle -= 2 * Math.PI;
  }
  boss.angle += (playerAngle - boss.angle) * 0.02;
}

function updateShooting(boss) {
  boss.update();
}

function hitAsteroid(boss) {

  // need to respawn asteroid


  // for (let i = asteroids.length - 1; i >= 0; i--) {
  //   let asteroid = asteroids[i];
  //   if (Math.abs(asteroid.x - boss.x) < 500 && Math.abs(asteroid.y - boss.y) < 500) {
  //     asteroids.splice(i, 1);
  //   }
  // }
}


module.exports = {
  move,
  update
};
