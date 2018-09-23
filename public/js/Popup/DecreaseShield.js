import Popup from './Popup.js';

export default class DecreaseShield extends Popup{

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
