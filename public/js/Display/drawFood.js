
import {isWithinScreenXAndY} from "../gameLogic.js";


export default function(currentPosition, food) {
  if (food) {
    for (let i = food.length - 1; i >= 0; i--) {
      if (isWithinScreenXAndY(currentPosition, food[i].x, food[i].y)) {
        food[i].move();
        food[i].displayFood();
      }
    }
  }

}
