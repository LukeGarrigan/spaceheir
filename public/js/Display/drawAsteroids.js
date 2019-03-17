import {isWithinScreenXAndY} from "../gameLogic.js";

export default function(asteroids, player) {
  for (let asteroid of asteroids) {
    if (asteroid.hasExploded) {
      asteroid.drawExplosion();
    }
    if (isWithinScreenXAndY(player, asteroid.x, asteroid.y)) {
      push();
      imageMode(CENTER);
      translate(asteroid.x, asteroid.y);
      rotate(radians(frameCount) / 4);
      image(asteroid.asteroidImage, 0, 0, asteroid.r, asteroid.r);
      pop();
    }

  }
}