
export default class MuteButton {

  constructor(soundOnImage, soundOffImage) {
    this.isMuted = false;
    this.soundOnImage = soundOnImage;
    this.soundOffImage = soundOffImage;
    this.x = 0;
    this.y = 0;
    this.viewX = 0;
    this.viewY = 0;
  }


  displayMuteButton(viewX, viewY) {
    this.viewX = viewX;
    this.viewY = viewY;

    this.x = viewX + height * 0.01;
    this.y = viewY +  height / 1.05;
    if (this.isMuted) {
      image(this.soundOffImage, this.x, this.y, 20, 20);
    } else {
      image(this.soundOnImage, this.x, this.y, 20, 20);
    }
  }

  checkIfClicked(mouseX, mouseY) {
    if (dist(this.viewX + mouseX, this.viewY + mouseY, this.x, this.y) < 40) {
      this.toggleMute();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
  }


}