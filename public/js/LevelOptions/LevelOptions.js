export default class LevelOptions {
  constructor(speedImage, playerSpeed) {
    this.viewX = 0;
    this.viewY = 0;
    this.x = 0;
    this.y = 0;
    this.width = 70;
    this.height = 50;
    this.speedImage = speedImage;
    this.playerSpeed = playerSpeed;
    this.imageWidth = 150;
  }

  display(viewX, viewY) {
    this.viewX = viewX;
    this.viewY = viewY;
    this.setXAndY();

    push();
    fill(100, 255, 100, 100);
    textAlign(CENTER);
    fill(255, 255, 255);
    image(this.speedImage, this.x, this.y);
    pop();
  }

  setXAndY() {
    this.y = this.viewY + windowHeight / 3.4 + height / 2;
    this.x = this.viewX + windowWidth / 2;
  }

  hasPlayerClickedOption(mouseX, mouseY) {

    if (this.viewX + mouseX < this.x + this.width && this.viewX + mouseX > this.x) {
      if (this.viewY + mouseY < this.y +  this.height && this.viewY + mouseY > this.y) {
        return true;
      }
    }
  }
}
