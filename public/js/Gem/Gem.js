export default class Gem {

  constructor(x, y, gemImage) {
    this.x = x;
    this.y = y;
    this.gemImage = gemImage;
    this.rotation = random(-HALF_PI, HALF_PI);
  }

  display() {


    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    image(this.gemImage, 0, 0, 30, 30);
    pop();
  }

}