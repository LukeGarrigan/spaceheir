const FRAMES = 40;

class Popup {

  constructor(increase) {
    this.increase = increase;
    this.timer = 0;
    this.isVisible = true;
    this.alpha = 0 ;
    this.displacement = 0;
    this.fillColor = color(0, 255, 0, 255 - this.alpha);
    this.strokeColor = color(255, 255, 255, 255 - this.alpha);
    this.textContent = "+" + increase;
    this.textSize = 15;
  }

  update() {
    this.timer += 1;
    this.alpha = map(this.timer, 0, FRAMES, 0, 255);
    this.displacement = map(this.timer, 0, FRAMES, 0, 30);
    if (this.timer >= FRAMES) {
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
  };
}


class DecreaseShield extends Popup{

    constructor(decrease) {
      super(decrease);
    }

    display() {
      if (this.isVisible) {
        push();
        fill(color(255, 0, 0, 255 - this.alpha));
        stroke(color(255, 255, 255, 255 - this.alpha));
        text(this.increase, player.pos.x, player.pos.y - player.r - this.displacement);
        pop();
      }
    }
}

class BasicTextPopup extends Popup {
  constructor(text, textSize) {
    super();
    this.textContent = text;
    this.textSize = textSize;
  }
}
