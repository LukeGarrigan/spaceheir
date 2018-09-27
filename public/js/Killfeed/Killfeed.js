export default class Killfeed {

  constructor() {
    this._killfeed = [];
    this._x = width - 400;
    this._y = 100;

    // this._killfeed.push(new Kill("blar", "blarer", 1.1, 0.1));
    // this._killfeed.push(new Kill("blar", "blarer", 1.1, 0.1));
  }

  display(playerPosition) {

    let radiusOfTriangle = 10;


    for (let i = 0; i < this._killfeed.length; i++) {
      let currentKill = this._killfeed[i];
      currentKill.update();
      push();
      textAlign(LEFT);

      translate(playerPosition.x + width / 3, playerPosition.y - height / 2.5 + i * 30);
      let currentX = 0;
      let killerSize = textWidth(currentKill.killer);
      push();
      // don't want it to rotate the text
      currentX = killerSize + (radiusOfTriangle*2);
      translate(currentX, -5);
      rotate(currentKill.killAngle + HALF_PI);
      triangle(-radiusOfTriangle, radiusOfTriangle,  0, -radiusOfTriangle, radiusOfTriangle, radiusOfTriangle);
      pop();

      // killer name
      fill(255);
      text(currentKill.killer, 0, 0);

      currentX += (radiusOfTriangle*2);
      text("eliminated", currentX, 0);



      currentX += textWidth("eliminated") +(radiusOfTriangle);
      text(currentKill.deather, currentX, 0);


      currentX += textWidth(currentKill.deather) + radiusOfTriangle * 2;
      push();
      fill(0);
      stroke(255);
      translate(currentX, -5);
      rotate(currentKill.deatherAngle + HALF_PI);
      triangle(-radiusOfTriangle, radiusOfTriangle,  0, -radiusOfTriangle, radiusOfTriangle, radiusOfTriangle);
      pop();
      pop();

    }

  }


  addKill(killer, deather, killAngle, deatherAngle) {
    if (this._killfeed.length > 3) {
      this._killfeed.splice(0, 1);
    }
    this._killfeed.push(new Kill(killer, deather, killAngle, deatherAngle));
  }


}


class Kill {

  constructor(killer, deather, killAngle, deatherAngle) {
    this._killer = killer;
    this._deather = deather;
    this._killAngle = killAngle;
    this._deatherAngle = deatherAngle;

    this.alpha = 0;
    this.timer = 0;
  }

  update() {
    this.alpha = map(this.timer, 0, 40, 0, 255);
    this.timer++;
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