import {isWithinScreenXAndY} from "../game-logic.js";

export default function(bullets, player) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();

    if (isWithinScreenXAndY(player, bullets[i].x, bullets[i].y)) {
      bullets[i].display();
    }
    if (bullets[i].timeAlive > 300) {
      bullets.splice(i, 1);
    }
  }
}