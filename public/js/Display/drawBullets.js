import {isWithinScreenXAndY} from "../gameLogic.js";

export default function(bullets, player) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    if (isWithinScreenXAndY(player, bullets[i].x, bullets[i].y)) {
      bullets[i].display();
    }
  }
}