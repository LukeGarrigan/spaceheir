
export default class WinnerLocation {

  constructor(image){
    this.angle = 0;
    this.image = image;
  }


  drawWinnerLocation(playerX, playerY,winnerX, winnerY) {
    let differenceY = playerY - winnerY;
    let differenceX = playerX - winnerX;

    if (abs(differenceY) < 1.5*window.innerHeight && abs(differenceX) < 1.5*window.innerWidth) return;

    this.angle = atan2(differenceY, differenceX);
    let radius = 1080 /4;

    let indicatorX = cos(this.angle) * radius;
    let indicatorY = sin(this.angle) * radius;

    push();
    translate(playerX, playerY);
    stroke(255);
    rotate(PI);
    fill(255, 69, 0);

      push();
      translate(indicatorX, indicatorY);
      rotate(this.angle);
      image(this.image, 0, 0);
      pop();
    // rect(indicatorX, indicatorY, 20, 20)
    pop();
  }

}