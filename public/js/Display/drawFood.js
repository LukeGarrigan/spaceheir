import {isWithinScreenXAndY} from "../gameLogic.js";
import Food from "../classes/Food.js";

import {PLAYAREA_WIDTH} from "../Constants.js";
import {PLAYAREA_HEIGHT} from "../Constants.js";



export default function (position, foods) {

  let foodClones = createFoodClones(foods);
  if (foodClones) {
    for (let i = foodClones.length - 1; i >= 0; i--) {
      if (isWithinScreenXAndY(position, foodClones[i].x, foodClones[i].y)) {
        foodClones[i].move();
        foodClones[i].displayFood();
      }
    }
  }
}



function createFoodClones(foods) {
  let foodClones = [];

  if (foods) {
    foods.forEach(food => {
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

  return foodClones;
}