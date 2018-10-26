import Popup from './Popup.js';
export default class DecreaseShield extends Popup{

  constructor(decrease, player) {
    super(color(237, 40, 14, 255),
          color(237, 40, 14, 255),
          decrease,
          player.x, player.y);

    this.playerX = player.x;
    this.playerY = player.y;
    this.displacementMax = 40;
  }




  display() {
    if (this.isVisible) {
      push();
      fill(this.fillColor);
      if (this.stroke) {
        stroke(this.strokeColor);
      }

      textSize(this.textSize);

      text(this.textContent,this.playerX - width / 2 + 80, this.playerY + height / 3  - this.displacement);
      pop();
    }
  }

  updatePlayerPosition(x, y) {
    this.playerX = x;
    this.playerY = y;
  }



}
