import socket from '../socket.js';

export default class Player {
  constructor(name) {
    this.name = name;
    this.pos = createVector(random(width*3), random(height*3));
    this.radians = 0;

    this.isLeft = false;
    this.isRight = false;
    this.isUp = false;
    this.isDown = false;
    this.speed = 2;
    this.shield = 0;
    this.score = 0;
    this.respawning = false;
    this.shieldRadius = 5;
  }

  display(leaders) {
    push();
    translate(this.pos.x, this.pos.y);
    fill(0);
    let leaderBoardWinnersId;
    if (leaders.length > 0) {
      leaderBoardWinnersId = leaders[0].id;
    }

    let winner = false;

    if (leaderBoardWinnersId == socket.id) {
      winner = true;
    }

    winner ? stroke(255, 69, 0) : stroke(255);


    this.radians = atan2(mouseY-height/2, mouseX-width/2);
    this.shieldRadius = map(this.shield, 0, 1000, 21, 0);
    this.offset = map(this.shield, 0, 1000, 0, 10);
    rotate(this.radians + HALF_PI);
    winner ? fill(255, 69, 0) : fill(255);
    triangle(-this.r, this.r,  0, -this.r, this.r, this.r);

    winner ? fill(255, 69, 0) : fill(255);
    fill(0);
    translate(0, -this.offset);
    triangle(-this.shieldRadius, this.shieldRadius, 0, -this.shieldRadius, this.shieldRadius, this.shieldRadius);
    pop();
    textAlign(CENTER);


    if (this.respawning) {
      push();
      fill(255, 0, 0);
      textSize(32)
      text('respawning...' , this.pos.x, this.pos.y+49);
      pop();
    } else {
      text(this.name, this.pos.x, this.pos.y+49);
    }

    push();
    textSize(30);
    fill(255);
    text(this.score, this.pos.x, this.pos.y - height/2 + 80);
    pop();
  }

  static drawOtherPlayer(player, leaderBoardWinnersId) {
    // Other player is respawning
    // TODO: If the player is respawning, client should not receive data.
    if (player.lastDeath !== null) {
      return;
    }

    let offset = map(player.shield, 0, 1000, 0, 10);
    push();
    translate(player.x, player.y);
    let shieldRadius = 0;
    let isWinning =  leaderBoardWinnersId === player.id;
    isWinning ? fill(255, 69, 0) : fill(255);
    isWinning ? stroke(255, 69, 0) : stroke(255);

    shieldRadius = map(player.shield, 0, 1000, 21, 0);
    rotate(player.angle + HALF_PI);
    triangle(-21, 21, 0, -21, 21, 21);
    fill(0);
    translate(0, -offset);
    triangle(-shieldRadius, shieldRadius, 0, -shieldRadius, shieldRadius,shieldRadius);
    pop();
    textAlign(CENTER);
    let name = player.name;
    textSize(15);
    text(name, player.x, player.y + 49);
  }

  increaseShield(sizeOfFood) {
    if (this.shield < config.settings.MAX_SHIELD) {
      this.shield = this.shield + sizeOfFood;
      if (this.shield > config.settings.MAX_SHIELD) {
        this.shield = config.settings.MAX_SHIELD;
      }
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

  reduceShield() {
    if (this.shield > config.settings.MAX_SHIELD_REDUCTION) {
      this.shield -= config.settings.MAX_SHIELD_REDUCTION
    } else {
      this.shield = 0;
      //this.pos = createVector(random(width), random(height));
    }
  }

  get x() {
    return this.pos.x;
  }

  get y() {
    return this.pos.y;
  }
}
