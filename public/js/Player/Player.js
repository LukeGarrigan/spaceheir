class Player {
  constructor(name) {
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
  }

  display(leaders) {
    push();
    translate(this.pos.x, this.pos.y);
    fill(0);
    let leaderBoardWinnersId;
    if (leaders.length > 0) {
      leaderBoardWinnersId = leaders[0].id;
    }

    if (leaderBoardWinnersId == socket.id) {
      stroke(255, 69, 0);
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
    fill(255);
    text(this.score, this.pos.x, this.pos.y - height/2 + 80);
    pop();
  }

  increaseShield(sizeOfFood) {
    if (this.shield < config.settings.MAX_SHIELD) {
      this.shield = this.shield + sizeOfFood;
      if (this.shield > config.settings.MAX_SHIELD) {
        this.shield = config.settings.MAX_SHIELD;
      }
    }
  }

  reduceShield() {
    if (this.shield > config.settings.MAX_SHIELD_REDUCTION) {
      this.shield -= config.settings.MAX_SHIELD_REDUCTION
    } else {
      this.shield = 0;
      //this.pos = createVector(random(width), random(height));
    }
  }

  up() {
    this.isUp = true;
  }

  down() {
    this.isDown = true;
  }

  left() {
    this.isLeft = true;
  }

  right() {
    this.isRight = true;
  }

  upReleased() {
    this.isUp = false;
  }

  downReleased() {
    this.isDown = false;
  }

  leftReleased() {
    this.isLeft = false;
  }

  rightReleased() {
    this.isRight = false;
  }

}
