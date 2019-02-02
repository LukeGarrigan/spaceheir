import {isWithinScreen} from "../game-logic.js";


export default function(currentPosition, food) {
  if (food) {
    for (let i = food.length - 1; i >= 0; i--) {
      if (isWithinScreen(currentPosition, food[i])) {
        food[i].move();
        food[i].displayFood();
      }
    }
  }

}
