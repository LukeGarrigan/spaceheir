import {isWithinScreenXAndY} from "../gameLogic.js";
import Food from "../classes/Food.js";



export default function (position, foods) {

  let foodClones = createFoodClones(foods);
  createFoodClones(foods, foodClones, PLAYAREA_WIDTH, PLAYAREA_HEIGHT);
  if (foodClones) {
    for (let i = foodClones.length - 1; i >= 0; i--) {
      if (isWithinScreenXAndY(position, foodClones[i].x, foodClones[i].y)) {
        foodClones[i].move();
        foodClones[i].displayFood();
      }
    }
  }
}



function createFoodClones(foods, foodClones) {

  const PLAYAREA_WIDTH = 10000;
  const PLAYAREA_HEIGHT = 6000;
  if (foods) {
    foods.forEach(food => {
      // the original screen
      foodClones.push(food);

      let foodImage = food.foodImage;

      let topLeft = new Food(food.x - PLAYAREA_WIDTH, food.y - PLAYAREA_HEIGHT, food.r, 123, foodImage);
      let top = new Food(food.x, food.y - PLAYAREA_HEIGHT, food.r, 123, foodImage);
      let topRight = new Food(food.x + PLAYAREA_WIDTH, food.y + -PLAYAREA_HEIGHT, food.r, 123, foodImage);
      let right = new Food(food.x + PLAYAREA_WIDTH, food.y, food.r, 123, foodImage);
      let bottomRight = new Food(food.x + PLAYAREA_WIDTH, food.y + +PLAYAREA_HEIGHT, food.r, 123, foodImage);
      let bottom = new Food(food.x, food.y + +PLAYAREA_HEIGHT, food.r, 123, foodImage);
      let bottomLeft = new Food(food.x + -PLAYAREA_WIDTH, food.y + +PLAYAREA_HEIGHT, food.r, 123, foodImage);
      let left = new Food(food.x + -PLAYAREA_WIDTH, food.y, food.r, 123, foodImage);


      foodClones.push(topLeft, top, topRight, right, bottomRight, bottom, bottomLeft, left);

    });

  }
}