let config = require('../../configs/defaults.js');

function update(boss, players) {
  move(boss, players);
  updateShooting(boss);
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
  let playerAngle  = Math.atan2(player.y - boss.y, player.x - boss.x);
  boss.angle = lerp(boss.angle, playerAngle, 0.02);
}

function lerp(start, stop, amount) {
  return amount * (stop - start) + start;
}

function updateShooting(boss) {
  boss.update();
}


module.exports = {
  move,
  update
};
