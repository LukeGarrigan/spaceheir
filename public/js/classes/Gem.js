import randomMovement from "../randomMovement.js";

export default class Gem {

  constructor(id, x, y, gemImage) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.gemImage = gemImage;
    this.rotation = random(-HALF_PI, HALF_PI);
    this.size = 0;
    this.maxSize = 30;
    this.sizeIncreaser = random(0.2, 0.3);

    this.initialiseRandomMovement();
  }

  display() {
    randomMovement(this);
    if (this.size < this.maxSize) {
      this.size += this.sizeIncreaser;
    }

    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    image(this.gemImage, 0, 0, this.size, this.size);
    pop();
  }

  initialiseRandomMovement() {
    this.maxMovement = 5;
    this.adjustment = this.maxMovement / 2;
    this.speed = 5;


    this.startX = this.x;
    this.startY = this.y;
    this.targetX = this.x;
    this.targetY = this.y;
  }





}