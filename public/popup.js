const FRAMES = 80;
let alpha;
let up;
class Popup {
  constructor(increase) {
    this.increase = increase;
    this.timer = 0;
    this.isVisible = true;
  }

  update() {
    this.timer += 1;
    alpha = map(this.timer, 0, FRAMES, 0, 255);
    up = map(this.timer, 0, FRAMES, 0, 15);
    if (this.timer >= FRAMES) {
      this.isVisible = false;
    }
  }

  display() {
    if (this.isVisible) {
      push();
      fill(color(0, 255, 0, 255 - alpha));
      stroke(color(255, 255, 255, 255 - alpha));
      text("+" + this.increase, player.pos.x, player.pos.y - player.r - up);
      pop();
    }
  };
}


class DecreaseShield extends Popup{

    constructor(decrease) {
      super(decrease);
    }

    display() {
      if (this.isVisible) {
        push();
        fill(color(255, 0, 0, 255 - alpha));
        stroke(color(255, 255, 255, 255 - alpha));
        text(this.increase, player.pos.x, player.pos.y - player.r - up);
        pop();
      }
    }
}
