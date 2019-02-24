export default class Minimap {

  constructor() {
    this.width = 300;
    this.height = 150;
    this.maxWidth = 5000;
    this.maxHeight = 3000;
    this.r = 5;
    this.angle = 0;

    this.xScaler = this.width/ 1920;
    this.yScaler = this.height/ 1080;
    this.minimapX = 0;
    this.minimapY = 0
  }


  displayMinimap(playerX, playerY, playerAngle, food) {
    this.angle = playerAngle;
    this.width = windowWidth * this.xScaler;
    this.height = windowHeight * this.yScaler;
    push();
    noFill();
    this.minimapX = playerX - windowWidth / 2.1;
    this.minimapY = playerY + windowHeight / 3.4;
    rect(this.minimapX, this.minimapY, this.width, this.height);
    translate(this.minimapX, this.minimapY);

    this.displayFoodOnMiniMap(food);
    this.displayPlayerOnMinimap(playerX, playerY, this.minimapX, this.minimapY);
    pop();

  }



  displayPlayerOnMinimap(playerX, playerY) {
    let littleRocketX = map(playerX, 0, this.maxWidth, 0, this.width);
    let littleRocketY = map(playerY, 0, this.maxHeight, 0, this.height);
    translate(littleRocketX, littleRocketY);
    rotate(this.angle + HALF_PI);
    triangle(-this.r, this.r,  0, -this.r, this.r, this.r);
  }

  displayFoodOnMiniMap(foods) {

    fill(255);
    for (const food of foods) {
      let actualFoodX = food.x;
      let actualFoodY = food.y;
      let foodMiniMapX = map(actualFoodX, 0, this.maxWidth, 0, this.width);
      let foodMiniMapY = map(actualFoodY, 0, this.maxHeight, 0, this.height);
      ellipse(foodMiniMapX, foodMiniMapY, 2, 2);
    }
  }
}