function Player() {

  this.pos = createVector(width/2, height/2);
  this.r = 21;
  this.radians = 0;

  this.isLeft = false;
  this.isRight = false;
  this.isUp = false;
  this.isDown = false;
  this.speed = 2;

  this.health = 100;
  this.shield = 0;




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
    if (this.pos.x < 0) {
      this.pos.x = width*3;
    } else if (this.pos.x > width*3) {
      this.pos.x = 0;
    }

    if (this.pos.y < 0) {
      this.pos.y = height*3;
    } else if (this.pos.y > height*3) {
      this.pos.y =0;
    }

  }

  this.increaseShield = function(sizeOfFood) {
    if (this.shield < 1000) {
      this.shield = this.shield + sizeOfFood;
      if (this.shield > 1000) {
        this.shield = 1000;
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
    if (this.shield > 75) {
      this.shield -= 75;
    } else {
      this.shield = 0;
    }
  }

}
