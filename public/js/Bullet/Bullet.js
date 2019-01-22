export default class Bullet{
  constructor(x, y, playerAngle, shooterId, id, bulletSize) {
    this.pos = createVector(x, y);
    this.velocity = p5.Vector.fromAngle(playerAngle);
    this.velocity.mult(30);
    this.r = 10;
    this.shooterId = shooterId;
    this.id = id;
    this.bulletSize = bulletSize;
  }

  update() {
    this.r = lerp(this.r, 0, 0.01);
    // this.pos.add(this.velocity);
    this.bulletSize--;
  }

  display() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }

  hasBulletDiminished() {
    if (this.hasDiminished()) {
      return true;
    }
  }

  hasDiminished() {
    if (this.r <= 1) {
      return true;
    }
    return false;
  }
}
