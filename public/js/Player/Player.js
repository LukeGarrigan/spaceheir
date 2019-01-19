import socket from '../socket.js';

export default class Player {
  constructor(name, spaceShipImage, winnerSpaceship) {
    this.name = name;
    this.pos = createVector(random(width*3), random(height*3));
    this.radians = 0;
    this.isUp = false;
    this.speed = 2;
    this.shield = 0;
    this.score = 0;
    this.isBoosting = false;
    this.respawning = false;
    this.spaceShipImage = spaceShipImage;
    this.winnerSpaceship = winnerSpaceship;
    this.trail = [];

  }

  display(leaders) {
    this.trail.push({x: this.pos.x, y: this.pos.y});
    if (this.trail.length > 150) {
      this.trail.splice(0, 1);
    }

    // this.drawTrail();


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
    this.offset = map(this.shield, 0, 1000, 0, 10);
    rotate(this.radians + HALF_PI);
    winner ? fill(255, 69, 0) : fill(255);
    imageMode(CENTER);
    if (winner) {
      image(this.winnerSpaceship, 0, 0);
    } else {
      image(this.spaceShipImage, 0, 0);
    }


    winner ? fill(255, 69, 0) : fill(255);
    fill(0);
    translate(0, -this.offset);
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


  static drawOtherPlayer(player, leaderBoardWinnersId, spaceShipImage, winnerSpaceship) {
    // Other player is respawning
    if (player.lastDeath !== null) {
      return;
    }

    let offset = map(player.shield, 0, 1000, 0, 10);
    push();
    translate(player.x, player.y);
    let isWinning =  leaderBoardWinnersId === player.id;

    rotate(player.angle + HALF_PI);
    imageMode(CENTER);

    if (isWinning) {
      image(winnerSpaceship, 0, 0);
    } else {
      image(spaceShipImage, 0, 0);
    }

    fill(0);
    translate(0, -offset);

    this.processOtherPlayersBooster(player);
    pop();
    textAlign(CENTER);
    let name = player.name;
    textSize(15);
    text(name, player.x, player.y + 49);
  }


  drawTrail() {
    push();

    fill(255, 127, 10, 30);
    blendMode(ADD);
    for (let i = 75; i < this.trail.length; i++) {
      let part = this.trail[i];
      ellipse(part.x += random(-0.3, 0.3), part.y += random(-0.3, 0.3), (i - 75) / 4.5);
    }
    pop();
  }


  static processOtherPlayersBooster(player) {
    translate(0, player.r / 2 + 20);
    if (player.isBoosting && player.shield > 0) {
      rotate(PI);
      fill(0);
    }
  }

  get x() {
    return this.pos.x;
  }

  get y() {
    return this.pos.y;
  }
}
