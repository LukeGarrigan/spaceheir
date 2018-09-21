class Popup {
  constructor(increase) {
    this.increase = increase;
    this.timer = 0;
    this.isVisible = true;
    this.alpha = 0;
    this.displacement = 0;
    this.fillColor = color(0, 255, 0, 255 - this.alpha);
    this.strokeColor = color(255, 255, 255, 255 - this.alpha);
    this.textContent = "+" + increase;
    this.textSize = 15;
  }

  update() {
    this.timer += 1;
    this.alpha = map(this.timer, 0, Popup.FRAMES, 0, 255);
    this.displacement = map(this.timer, 0, Popup.FRAMES, 0, 30);
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
