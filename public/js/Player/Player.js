import socket from '../socket.js';

export default class Player {
  constructor(name, spaceShipImage, winnerSpaceship) {
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
    this.isBoosting = false;
    this.respawning = false;
    this.shieldRadius = 5;
    this.spaceShipImage = spaceShipImage;
    this.winnerSpaceship = winnerSpaceship;
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

    if (leaderBoardWinnersId === socket.id) {
      winner = true;
    }

    winner ? stroke(255, 69, 0) : stroke(255);


    this.radians = atan2(mouseY-height/2, mouseX-width/2);
    this.shieldRadius = map(this.shield, 0, 1000, 21, 0);
    this.offset = map(this.shield, 0, 1000, 0, 10);
    rotate(this.radians + HALF_PI);
    winner ? fill(255, 69, 0) : fill(255);
    imageMode(CENTER);
    if (winner) {
      image(this.winnerSpaceship, 0, 0);
    } else {
      image(this.spaceShipImage, 0, 0);
    }

    // triangle(-this.r, this.r,  0, -this.r, this.r, this.r);

    winner ? fill(255, 69, 0) : fill(255);
    fill(0);
    translate(0, -this.offset);
    //triangle(-this.shieldRadius, this.shieldRadius, 0, -this.shieldRadius, this.shieldRadius, this.shieldRadius);
    this.handlePlayerBoosting();
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

  handlePlayerBoosting() {
    translate(0, this.r/2+20);
    if (this.isBoosting && this.shield > 0) {
      rotate(PI);
      fill(0);


      // triangle(-this.r/3, this.r/3, 0, -this.r/3, this.r/3, this.r/3);
    }

  }

  static drawOtherPlayer(player, leaderBoardWinnersId, spaceShipImage, winnerSpaceship) {
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


    shieldRadius = map(player.shield, 0, 1000, 21, 0);
    rotate(player.angle + HALF_PI);
    imageMode(CENTER);

    if (isWinning) {
      image(winnerSpaceship, 0, 0);
    } else {
      image(spaceShipImage, 0, 0);
    }

    // triangle(-21, 21, 0, -21, 21, 21);
    fill(0);
    translate(0, -offset);


    // triangle(-shieldRadius, shieldRadius, 0, -shieldRadius, shieldRadius,shieldRadius);
    this.processOtherPlayersBooster(player);
    pop();
    textAlign(CENTER);
    let name = player.name;
    textSize(15);
    text(name, player.x, player.y + 49);
  }


  static processOtherPlayersBooster(player) {
    translate(0, player.r / 2 + 20);
    if (player.isBoosting && player.shield > 0) {
      rotate(PI);
      fill(0);
      // triangle(-player.r / 3, player.r / 3, 0, -player.r / 3, player.r / 3, player.r / 3);
    }
  }

  get x() {
    return this.pos.x;
  }

  get y() {
    return this.pos.y;
  }
}
