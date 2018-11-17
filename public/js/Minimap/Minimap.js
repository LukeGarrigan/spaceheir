export default class Minimap {

  constructor() {
    this.width = 300;
    this.height = 150;
    this.maxWidth = 5760;
    this.maxHeight = 3240;
    this.r = 5;
    this.angle = 0;

    this.xScaler = this.width/ 1920;
    this.yScaler = this.height/ 1080;
    this.food = [];
  }


  displayMinimap(playerX, playerY, playerAngle, food) {
    this.angle = playerAngle;
    this.width = windowWidth * this.xScaler;
    this.height = windowHeight * this.yScaler;
    this.food = food;

    push();
    // stroke(255);
    noFill();
    let minimapX = playerX - windowWidth / 2.1;
    let minimapY = playerY + windowHeight / 3.4;
    rect(minimapX, minimapY, this.width, this.height);
    translate(minimapX, minimapY);

    this.displayFoodOnMinimap(food);
    this.displayPlayerOnMinimap(playerX, playerY, minimapX, minimapY);
    pop();

  }

  displayPlayerOnMinimap(playerX, playerY) {
    let littleRocketX = map(playerX, 0, this.maxWidth, 0, this.width);
    let littleRocketY = map(playerY, 0, this.maxHeight, 0, this.height);
    translate(littleRocketX, littleRocketY);
    rotate(this.angle + HALF_PI);
    triangle(-this.r, this.r,  0, -this.r, this.r, this.r);
  }

  displayFoodOnMinimap(foods) {

    fill(255);
    for (const food of foods) {

      let actualFoodX = food.x;
      let actualFoodY = food.y;

      let foodMinimapX = map(actualFoodX, 0, this.maxWidth, 0, this.width);
      let foodMinimapY = map(actualFoodY, 0, this.maxHeight, 0, this.height);

      ellipse(foodMinimapX, foodMinimapY, 2, 2);
    }
  }
}