import socket from '../socket.js';
import healthbar from "../Healthbar/healthbar.js";
import Trail from "../Trail.js";

export default class Player {
  constructor(name, spaceShipImage, winnerSpaceship) {
    this.name = name;
    this.pos = createVector(random(width * 3), random(height * 3));
    this.radians = 0;
    this.speed = 2;
    this.shield = 0;
    this.score = 0;
    this.respawning = false;
    this.spaceShipImage = spaceShipImage;
    this.winnerSpaceship = winnerSpaceship;
    this.trail = [];
    this.lvl = 1;

    this.trail = new Trail();

  }

  display(leaders) {
    this.trail.updateTrail(this.pos);
    this.trail.drawTrail();
    this.drawShip(leaders);
    textAlign(CENTER);


    if (this.respawning) {
      this.displayRespawningText();
    } else {
      text(`${this.name} (${this.lvl})`, this.pos.x, this.pos.y + 49);
    }
    this.displayScore();
    healthbar(this);
  }



  drawShip(leaders) {
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


    this.radians = atan2(mouseY - height / 2, mouseX - width / 2);
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
  }

  displayRespawningText() {
    push();
    fill(255, 0, 0);
    textSize(32);
    text('respawning...', this.pos.x, this.pos.y + 49);
    pop();
  }


  displayScore() {
    push();
    textSize(30);
    fill(255);
    text(this.score, this.pos.x, this.pos.y - height / 2 + 80);
    pop();
  }

  get x() {
    return this.pos.x;
  }

  get y() {
    return this.pos.y;
  }
}
