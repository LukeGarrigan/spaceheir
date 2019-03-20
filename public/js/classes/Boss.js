
export default class Boss {
  constructor(id, x, y, bossImage, angle) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.image = bossImage;
    this.angle = angle;
    this.isLaser = false;

  }

  draw() {
    this.drawRing();






    imageMode(CENTER);
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    this.drawLaser();
    image(this.image, 0, 0, this.image.width, this.image.height);
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

  drawLaser() {
    if (this.isLaser) {
      fill(255,0, 0, 50);
      noStroke();
      rect(0, -14, 1500, 40);
    }
  }
}
