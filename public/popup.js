const FRAMES = 80;

class Popup {
  constructor(increase) {
    this.increase = increase;
    this.timer = 0;
    this.isVisible = true;
  }

  display() {
    if (this.isVisible) {
      this.timer += 1;

      const alpha = map(this.timer, 0, FRAMES, 0, 255);
      const up = map(this.timer, 0, FRAMES, 0, 15);

      push();
      fill(color(0, 255, 0, 255 - alpha));
      stroke(color(255, 255, 255, 255 - alpha));
      text("+" + this.increase, player.pos.x, player.pos.y - player.r - up);
      pop();

      if (this.timer >= FRAMES) {
        this.isVisible = false;
      }
    }
  };
}