export default class Bullet{
  constructor(x, y, id) {
    this.x = x;
    this.y = y;
    this.r = 10;
    this.id = id;
  }

  update() {
    this.r -= 0.01;
  }

  display() {
    fill(255);
    ellipse(this.x, this.y, this.r, this.r);
  }
}
