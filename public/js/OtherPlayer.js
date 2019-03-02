import healthbar from "./Display/healthbar.js";
import Trail from "./Trail.js";

export default class OtherPlayer {
  constructor(x, y, lastDeath, id, name, lvl, angle) {
    this.x = x;
    this.y = y;
    this.lastDeath = lastDeath;
    this.id = id;
    this.name = name;
    this.lvl = lvl;
    this.angle = angle;
    this.trail = new Trail();
  }

  draw(leaderBoardWinnersId, spaceShipImage, winnerSpaceship) {
    // Other player is respawning
    if (this.lastDeath !== null) {
      return;
    }

    this.pos = {
      x: this.x,
      y: this.y
    };


    this.trail.updateTrail(this.pos);
    this.trail.drawTrail();

    push();
    translate(this.x, this.y);



    let isWinning = leaderBoardWinnersId === this.id;

    rotate(this.angle + HALF_PI);
    imageMode(CENTER);




    if (isWinning) {
      image(winnerSpaceship, 0, 0);
    } else {
      image(spaceShipImage, 0, 0);
    }

    pop();
    textAlign(CENTER);
    textSize(15);
    text(`${this.name} (${this.lvl})`, this.x, this.y + 49);





    healthbar(this);

  }





}