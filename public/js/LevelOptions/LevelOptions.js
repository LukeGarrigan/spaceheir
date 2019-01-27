export default class LevelOptions {
  constructor(image, imageTransparent, currentLvl) {
    this.viewX = 0;
    this.viewY = 0;
    this.x = 0;
    this.y = 0;
    this.height = 37;
    this.image = image;
    this.imageTransparent = imageTransparent;
    this.width = 150;
    this.currentLvl = 0;
  }

  display(viewX, viewY, isVisible, currentLvl) {
    this.viewX = viewX;
    this.viewY = viewY;
    this.currentLvl = currentLvl;
    this.setXAndY();

    push();
    textAlign(CENTER);
    fill(255, 255, 255);

    text(this.currentLvl, this.x + this.width / 2, this.y - 10);
    if (isVisible) {
      image(this.image, this.x, this.y);
    } else {
      image(this.imageTransparent, this.x, this.y);
    }

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
