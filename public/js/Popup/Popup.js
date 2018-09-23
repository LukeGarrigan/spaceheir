class Popup {
  constructor(fillColor, strokeColor, content) {
    this.timer = 0;
    this.isVisible = true;
    this.alpha = 0;
    this.displacement = 0;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.textContent = content;
    this.textSize = 15;
    this.displacementMax = 50;

  }
  update() {
    this.timer += 1;
    this.alpha = map(this.timer, 0, Popup.FRAMES, 0, 255);
    this.displacement = map(this.timer, 0, Popup.FRAMES, 0,this.displacementMax);
    if (this.timer >= Popup.FRAMES) {
      this.isVisible = false;
    }
  }

  display() {
    if (this.isVisible) {
      push();
      console.log("DISPLAYING!!!!");

      fill(this.fillColor);
      stroke(this.strokeColor);
      textSize(this.textSize);
      text(this.textContent, player.pos.x, player.pos.y - player.r - this.displacement);
      pop();
    }
  }
}

Popup.FRAMES = 40;
