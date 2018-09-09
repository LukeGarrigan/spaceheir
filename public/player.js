function Player() {

  const MAX_SHIELD_REDUCTION = 75;
  const MAX_SHIELD = 1000;

  this.pos = createVector(random(width*3), random(height*3));
  this.r;
  this.radians = 0;

  this.isLeft = false;
  this.isRight = false;
  this.isUp = false;
  this.isDown = false;
  this.speed = 2;


  this.updateAndDisplayPlayer = function() {
    this.update();
    this.display();
    this.constrain();
  }

  this.update = function() {
    if (this.isUp) {
      this.pos.y -= this.speed;
    }
    if (this.isDown) {
      this.pos.y += this.speed;
    }

    if (this.isLeft) {
      this.pos.x -= this.speed;
    }

    if (this.isRight) {
      this.pos.x += this.speed;
    }

  }

  this.display = function() {

    push();
    translate(this.pos.x, this.pos.y);
    fill(0);
    stroke(255);
    this.radians = atan2(mouseY-height/2, mouseX-width/2);
    rotate(this.radians + HALF_PI);
    // ellipse(0, 0, this.r*3, this.r*3);
    triangle(-this.r, this.r,  0, -this.r, this.r, this.r);


    pop();

  }


  this.constrain = function() {


  }

  this.increaseShield = function(sizeOfFood) {
    if (this.shield < MAX_SHIELD) {
      this.shield = this.shield + sizeOfFood;
      if (this.shield > MAX_SHIELD) {
        this.shield = MAX_SHIELD;
      }
    }
  }

  this.up = function() {
    this.isUp = true;
  }

  this.down = function() {
    this.isDown = true;
  }

  this.left = function() {
    this.isLeft = true;
  }

  this.right = function() {
    this.isRight = true;
  }

  this.upReleased = function() {
    this.isUp = false;
  }

  this.downReleased = function() {
    this.isDown = false;
  }

  this.leftReleased = function() {
    this.isLeft = false;
  }

  this.rightReleased = function() {
    this.isRight = false;
  }

  this.reduceShield = function() {
    if (this.shield > MAX_SHIELD_REDUCTION) {
      this.shield -= MAX_SHIELD_REDUCTION
    } else {
      this.shield = 0;
      //this.pos = createVector(random(width), random(height));
    }
  }

}
