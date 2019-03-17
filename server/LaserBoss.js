let Boss = require('./Boss.js');
class LaserBoss extends Boss{
  constructor() {
    super();
    this.isLaser = true;
    this.shootingTime = 120;
    this.timeNotShooting = 300;
  }


  update() {
    if (this.isLaser) {
      this.shootingTime--;
    } else {
      this.timeNotShooting--;
    }

    if (this.shootingTime <= 0 && this.isLaser) {
      this.isLaser = false;
      this.timeNotShooting = 300;
    }

    if (this.timeNotShooting <= 0 && !this.isLaser) {
      this.isLaser = true;
      this.shootingTime = 120;
    }
  }



}

module.exports = LaserBoss;