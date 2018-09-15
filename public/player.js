function Player(name) {

  const MAX_SHIELD_REDUCTION = 75;
  const MAX_SHIELD = 1000;

  this.name = name;
  this.pos = createVector(random(width*3), random(height*3));
  this.r;
  this.radians = 0;

  this.isLeft = false;
  this.isRight = false;
  this.isUp = false;
  this.isDown = false;
  this.speed = 2;
  this.shield = 0;
  this.score = 0;
  this.respawning = false;


  this.updateAndDisplayPlayer = function(leaders) {
    this.display(leaders);
    this.constrain();
  }

  this.display = function(leaders) {
    push();
    translate(this.pos.x, this.pos.y);
    fill(0);
    let leaderBoardWinnersId;
    if (leaders.length > 0) {
      leaderBoardWinnersId = leaders[0].id;
    }

    if (leaderBoardWinnersId == socket.id) {
      stroke(255, 0, 0);
    } else {
      stroke(255);
    }



    this.radians = atan2(mouseY-height/2, mouseX-width/2);
    rotate(this.radians + HALF_PI);

    triangle(-this.r, this.r,  0, -this.r, this.r, this.r);

    pop();
    textAlign(CENTER);


    if (this.respawning) {
      fill(255, 0, 0)
      textSize(32)
    }
    text(this.respawning ? 'respawning...' : name, this.pos.x, this.pos.y+49);
    push();
    textSize(30);
    text(this.score, this.pos.x, this.pos.y - height/2 + 80);
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
