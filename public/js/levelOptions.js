export default class DisplayLevelOptions {
  constructor() {
    this.viewX = 0;
    this.viewY = 0;
    this.x = 0;
    this.y = 0;
    this.width = 70;
    this.height = 50;
  }

  display(viewX, viewY) {
    this.viewX = viewX;
    this.viewY = viewY;

    this.y = this.viewY + windowHeight / 3.4 + height / 2;
    this.x = this.viewX + windowWidth / 2;


    push();
    fill(100, 255, 100, 100);
    rect(this.x, this.y, this.width, this.height);
    textAlign(CENTER);
    fill(255, 255, 255);
    text("Speed++", this.x + this.width/2, this.y + this.height/2);
    pop();
  }

  hasPlayerClickedOption(mouseX, mouseY) {

    if (this.viewX + mouseX < this.x + this.width && this.viewX + mouseX > this.x) {
      if (this.viewY + mouseY < this.y +  this.height && this.viewY + mouseY > this.y) {
        return true;
      }
    }
  }
}
