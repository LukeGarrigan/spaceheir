export default class Trail {
  constructor() {
    this.trail = [];
  }

  drawTrail() {
    push();
    fill(255, 127, 10);
    blendMode(ADD);
    for (let i = 75; i < this.trail.length; i++) {
      let part = this.trail[i];
      ellipse(part.x += random(-0.3, 0.3), part.y += random(-0.3, 0.3), (i - 75) / 6);
    }
    pop();
  }


  updateTrail(pos) {
    for (let i = 0; i < 10; i++) {
      this.trail.push({x: pos.x, y: pos.y});
    }
    if (this.trail.length > 200) {

      for (let i = 0; i < 10; i++) {
        this.trail.splice(0, 1);
      }
    }

  }



}