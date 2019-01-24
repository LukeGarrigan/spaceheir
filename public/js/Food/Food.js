import randomMovement from '../randomMovement.js';
export default class Food {
  constructor(x, y, r, id, foodImage) {
    this.foodImage = foodImage;
    this.frame = 0;
    this.x = x;
    this.y = y;
    this.r = r;
    this.id = id;
    this.initialiseRandomMovement();
  }

  displayFood() {
    this.frame++;
    push();
    image(this.foodImage, this.x, this.y, this.r, this.r);
    pop();
  }

  reset() {
    this.targetX = this.x;
    this.targetY = this.y;
    this.startX = this.x;
    this.startY = this.y;
  }

  initialiseRandomMovement() {
    this.maxMovement = 15;
    this.adjustment = this.maxMovement / 2;
    this.speed = 15;


    this.startX = this.x;
    this.startY = this.y;
    this.targetX = this.x;
    this.targetY = this.y;
  }

  move() {
    randomMovement(this);
  };
}
