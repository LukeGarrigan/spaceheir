import {PLAYAREA_HEIGHT, PLAYAREA_WIDTH} from "../Constants.js";

export default class Boss {
  constructor(id, x, y, bossImage, angle, health) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.image = bossImage;
    this.angle = angle;
    this.isLaser = false;
    this.health = health;

  }

  draw() {



    this.clones = this.getBossClones();

    for (let clone of this.clones) {
      push();
      imageMode(CENTER);
      translate(clone.x, clone.y);
      this.drawRing();
      rotate(this.angle);
      this.drawLaser();
      image(this.image, 0, 0, this.image.width, this.image.height);
      pop();
    }

    this.drawHealth();
  }


  getBossClones() {
    let clones = [];
    clones.push({x: this.x, y: this.y});
    clones.push({x: this.x - PLAYAREA_WIDTH, y: this.y - PLAYAREA_HEIGHT});
    clones.push({x: this.x, y: this.y - PLAYAREA_HEIGHT});
    clones.push({x: this.x + PLAYAREA_WIDTH, y: this.y + -PLAYAREA_HEIGHT});
    clones.push({x: this.x + PLAYAREA_WIDTH, y: this.y});
    clones.push({x: this.x + PLAYAREA_WIDTH, y: this.y + PLAYAREA_HEIGHT});
    clones.push({x: this.x, y: this.y + PLAYAREA_HEIGHT});
    clones.push({x: this.x - PLAYAREA_WIDTH, y: this.y + PLAYAREA_HEIGHT});
    clones.push({x: this.x - PLAYAREA_WIDTH, y: this.y});

    return clones;

  }

  drawRing() {
    push();
    strokeWeight(10);
    stroke(42, 245, 255, 100);
    noFill();
    ellipse(0, 0, 3000, 3000);
    pop();
  }

  drawLaser() {
    if (this.isLaser) {
      fill(255, 0, 0, 50);
      noStroke();
      rect(0, -14, 1500, 40);
    }
  }

  drawHealth() {
    const MAX_HEALTH = 100000;
    push();
    fill(0, 255, 100);
    let widthOfBar = map(this.health, 0, MAX_HEALTH, 0, 400);

    rectMode(CENTER);
    rect(this.x, this.y + 60, widthOfBar, 30);

    text(floor(this.health) + "/" + MAX_HEALTH, this.x, this.y + 100);

    let percentageHealth = map(this.health, 0, 100000, 0, 100);
    text(floor(percentageHealth) + "%", this.x, this.y + 120);
    pop();
  }
}
