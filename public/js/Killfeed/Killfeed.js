export default class Killfeed {

  constructor() {
    this._killfeed = [];
    this._x = width - 400;
    this._y = 100;
  }

  displayKillfeed(playerPosition, spaceshipImage, winnerSpaceshipImage) {
    textSize(15);
    let radiusOfTriangle = 10;
    for (let i = 0; i < this._killfeed.length; i++) {
      let currentKill = this._killfeed[i];
      push();
      textAlign(LEFT);
      translate(playerPosition.x + width / 4, playerPosition.y - height / 2.5 + i * 30);
      let currentX = 0;
      let killerTextSize = textWidth(currentKill.killer);

      text(currentKill.killer, 0, 0);
      currentX = this.drawKiller(currentX, killerTextSize, radiusOfTriangle, currentKill, winnerSpaceshipImage, spaceshipImage);
      currentX += (radiusOfTriangle * 2);

      currentX = this.drawEliminatedText(currentX, radiusOfTriangle, currentKill);

      currentX = this.drawDeatherText(currentX, currentKill, radiusOfTriangle);
      this.drawDeather(currentX, currentKill, radiusOfTriangle, winnerSpaceshipImage, spaceshipImage);
      pop();
    }

  }



  drawKiller(currentX, killerTextSize, radiusOfTriangle, currentKill, winnerSpaceshipImage, spaceshipImage) {
    push();
    currentX = killerTextSize + (radiusOfTriangle * 2);
    translate(currentX, -5);
    rotate(currentKill.killAngle + HALF_PI);
    if (currentKill.killerWinner) {
      imageMode(CENTER);
      image(winnerSpaceshipImage, 0, 0, winnerSpaceshipImage.width / 2, winnerSpaceshipImage.height / 2);
    } else {
      imageMode(CENTER);
      image(spaceshipImage, 0, 0, winnerSpaceshipImage.width / 2, winnerSpaceshipImage.height / 2);
    }
    pop();
    return currentX;
  }



  drawEliminatedText(currentX, radiusOfTriangle, currentKill) {
    text("eliminated", currentX, 0);
    currentX += textWidth("eliminated") + (radiusOfTriangle);
    text(currentKill.deather, currentX, 0);
    return currentX;
  }



  drawDeatherText(currentX, currentKill, radiusOfTriangle) {
    currentX += textWidth(currentKill.deather) + radiusOfTriangle * 2;
    return currentX;
  }


  drawDeather(currentX, currentKill, radiusOfTriangle, winnerSpaceshipImage, spaceshipImage) {
    push();
    translate(currentX, -5);
    rotate(currentKill.deatherAngle + HALF_PI);
    if (currentKill.deatherWinner) {
      imageMode(CENTER);
      image(winnerSpaceshipImage, 0, 0, winnerSpaceshipImage.width / 2, winnerSpaceshipImage.height / 2);
    } else {
      imageMode(CENTER);
      image(spaceshipImage, 0, 0, winnerSpaceshipImage.width / 2, winnerSpaceshipImage.height / 2);
    }
    pop();
  }


  addKill(killer, deather, killerWinner, deatherWinner, killAngle, deatherAngle) {
    if (this._killfeed.length > 3) {
      this._killfeed.splice(0, 1);
    }
    this._killfeed.push(new Kill(killer, deather, killerWinner, deatherWinner, killAngle, deatherAngle));
  }


}


class Kill {

  constructor(killer, deather, killerWinner, deatherWinner, killAngle, deatherAngle) {
    this._killer = killer;
    this._deather = deather;
    this._killAngle = killAngle;
    this._deatherAngle = deatherAngle;
    this._killerWinner = killerWinner;
    this._deatherWinner = deatherWinner;

    this.alpha = 0;
    this.timer = 0;
  }

  update() {
    this.alpha = map(this.timer, 0, 40, 0, 255);
    this.timer++;
  }


  get killerWinner() {
    return this._killerWinner;
  }

  set killerWinner(value) {
    this._killerWinner = value;
  }

  get deatherWinner() {
    return this._deatherWinner;
  }

  set deatherWinner(value) {
    this._deatherWinner = value;
  }

  get killer() {
    return this._killer;
  }

  set killer(value) {
    this._killer = value;
  }

  get deather() {
    return this._deather;
  }

  set deather(value) {
    this._deather = value;
  }

  get killAngle() {
    return this._killAngle;
  }

  set killAngle(value) {
    this._killAngle = value;
  }

  get deatherAngle() {
    return this._deatherAngle;
  }

  set deatherAngle(value) {
    this._deatherAngle = value;
  }
}