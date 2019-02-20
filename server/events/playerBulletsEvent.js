const { bullets } = require('../server');

module.exports = function(_, myBullets) {
  for (let i = 0; i < myBullets.length; i++) {
    for (let j = 0; j < bullets.length; j++) {
      if (myBullets[i].id === bullets[j].id) {
        bullets[j].x = myBullets[i].x;
        bullets[j].y = myBullets[i].y;
        bullets[j].bulletSize = myBullets[i].bulletSize;
      }
    }
  }
}
