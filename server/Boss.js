let config = require('../configs/defaults.js');


class Boss {
  constructor() {
      this.x = Math.floor(Math.random() * (config.PLAYAREA_WIDTH - 800)) + 800;
      this.y = Math.floor(Math.random() * (config.PLAYAREA_HEIGHT - 700)) + 700;
      this.id = 1;
      this.angle = 0;

  }

  update() {

  }

};

module.exports = Boss;