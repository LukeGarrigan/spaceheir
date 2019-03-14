let config = require('../../configs/defaults.js');


function move(boss, players) {

  let player = players[0];


  if (player) {
    let speed = 1;
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



    setAngle(player, boss);


  }

}

function setAngle(player, boss) {
  boss.angle = Math.atan2(player.y - boss.y, player.x - boss.x);
}



module.exports = {
  move,
};
