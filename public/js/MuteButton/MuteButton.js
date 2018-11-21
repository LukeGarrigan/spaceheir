
export default class MuteButton {

  constructor(soundOnImage, soundOffImage) {
    this.isMuted = false;
    this.soundOnImage = soundOnImage;
    this.soundOffImage = soundOffImage;
    this.x = 0;
    this.y = 0;
  }


  display(minimapX, minimapY) {
    this.x = minimapX;
    this.y = minimapY;
    if (this.isMuted) {
      image(this.soundOffImage, this.x, this.y, 30, 30);
    } else {
      image(this.soundOnImage, this.x, this.y, 30, 30);
    }
  }

  checkIfClicked(mouseX, mouseY) {

    let topLeftCornerX = this.x -width/2;
    let topLeftCornerY = this.y - height/2;

    if (dist(topLeftCornerX + mouseX, topLeftCornerY + mouseY, this.x, this.y) < 40) {
      this.toggleMute();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
  }


}