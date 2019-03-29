let config = require('../configs/defaults.js');


class Boss {
  constructor() {
    this.respawn();
  }

  update() {

  }

  respawn() {
    this.x = Math.floor(Math.random() * (config.PLAYAREA_WIDTH - 800)) + 800;
    this.y = Math.floor(Math.random() * (config.PLAYAREA_HEIGHT - 700)) + 700;
    this.id = 1;
    this.angle = 2;
    this.health = 100000;
  }
};

module.exports = Boss;