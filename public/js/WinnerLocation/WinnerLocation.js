

export default class WinnerLocation {

  constructor(image){
    this.angle = 0;
    this.image = image;
  }


  drawWinnerLocation(playerX, playerY,winnerX, winnerY) {
    let differenceY = playerY - winnerY;
    let differenceX = playerX - winnerX;

    if (abs(differenceY) < 1.2*1080 && abs(differenceX) < 1.2*1920) return;

    this.angle = atan2(differenceY, differenceX);
    let radius = window.innerWidth /5;

    let indicatorX = cos(this.angle) * radius;
    let indicatorY = sin(this.angle) * radius;

    push();
    translate(playerX, playerY);
    stroke(255);
    rotate(PI);
    fill(255, 69, 0);
    this.rotateAndDisplayIndicator(indicatorX, indicatorY);
    pop();
  }


  rotateAndDisplayIndicator(indicatorX, indicatorY) {
    push();
    translate(indicatorX, indicatorY);
    rotate(this.angle);
    image(this.image, 0, 0, 20, 40);
    pop();
  }
}