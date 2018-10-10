export default class Food {
  constructor(x, y, r, id) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.r = r;
    this.id = id;
    this.speed = 15;

    this.maxMovement = 15;
    this.adjustment = this.maxMovement / 2;
    this.frame = 0;

    this.targetX = this.x;
    this.targetY = this.y;
  }

  displayFood() {
    this.frame++;
    push();
    fill(255);
    colorMode(HSB, 255);
    ellipse(this.x, this.y, this.r, this.r);
    pop();
  }

  reset() {
    this.targetX = this.x;
    this.targetY = this.y;
    this.startX = this.x;
    this.startY = this.y;
  }

  move() {

    if (this.x === this.targetX || this.y === this.targetY) {
      this.targetX = this.x + random(-this.speed, this.speed);
      this.targetY = this.y + random(-this.speed, this.speed);
    }

    if (abs(this.x -this.targetX) < 1) {
      this.targetX = this.x + random(-this.speed, this.speed);
    }

    if (abs(this.y -this.targetY) < 1) {
      this.targetY = this.y + random(-this.speed, this.speed);
    }

    this.x = lerp(this.x, this.targetX, 0.02);
    this.y = lerp(this.y, this.targetY, 0.02);

    if (this.x > this.startX + this.maxMovement) {
      this.targetX -= this.adjustment;
    }
    if (this.x < this.startX - this.maxMovement) {
      this.targetX += this.adjustment;
    }

    if (this.y > this.startY + this.maxMovement) {
      this.targetY -= this.adjustment;
    }

    if (this.y < this.startY - this.maxMovement) {
      this.targetY += this.adjustment;
    }

  };
}
