
export default class Boss {
  constructor(id, x, y, bossImage) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.image = bossImage;
    this.angle = 2;

  }

  draw() {
    this.drawRing();
    imageMode(CENTER);
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    image(this.image, 0, 0, this.image.width * 1.5, this.image.height * 1.5);
    pop();
  }

  drawRing() {
    push();
    strokeWeight(10);
    stroke(42,245,255, 100);
    noFill();
    ellipse(this.x, this.y, 3000, 3000);
    pop();
  }
}
