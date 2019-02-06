import {isWithinScreen} from "../game-logic.js";

export default function(bullets, player) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    if (isWithinScreen(player, bullets[i].pos)) {
      bullets[i].display();
    }
  }
}