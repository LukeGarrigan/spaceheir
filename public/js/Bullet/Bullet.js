export default class Bullet{
  constructor(x, y, id) {
    this.pos = createVector(x, y);
    this.r = 10;
    this.id = id;
  }

  update() {
    this.r -= 0.01;
  }

  display() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }
}
