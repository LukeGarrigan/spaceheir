import {isWithinScreenXAndY} from "../gameLogic.js";
import {PLAYAREA_HEIGHT, PLAYAREA_WIDTH} from "../Constants.js";
import Asteroid from "../Asteroid/Asteroid.js";


export default function(asteroids, player) {
  
  let asteroidClones = createAsteroidClones(asteroids);
  
  for (let asteroid of asteroidClones) {
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

function createAsteroidClones(asteroids) {

  let asteroidsClones = [];


  if (asteroids) {
    asteroids.forEach(asteroid => {
      asteroidsClones.push(asteroid);

      let asteroidImage = asteroid.asteroidImage;

      let topLeft = new Asteroid(asteroid.x - PLAYAREA_WIDTH, asteroid.y - PLAYAREA_HEIGHT, 123, asteroidImage, asteroid.r);
      let top = new Asteroid(asteroid.x, asteroid.y - PLAYAREA_HEIGHT, 123, asteroidImage, asteroid.r);
      let topRight = new Asteroid(asteroid.x + PLAYAREA_WIDTH, asteroid.y + -PLAYAREA_HEIGHT, 123, asteroidImage, asteroid.r);
      let right = new Asteroid(asteroid.x + PLAYAREA_WIDTH, asteroid.y, 123, asteroidImage, asteroid.r);
      let bottomRight = new Asteroid(asteroid.x + PLAYAREA_WIDTH, asteroid.y + +PLAYAREA_HEIGHT, 123, asteroidImage, asteroid.r);
      let bottom = new Asteroid(asteroid.x, asteroid.y + +PLAYAREA_HEIGHT, 123, asteroidImage, asteroid.r);
      let bottomLeft = new Asteroid(asteroid.x + -PLAYAREA_WIDTH, asteroid.y + +PLAYAREA_HEIGHT, 123, asteroidImage, asteroid.r);
      let left = new Asteroid(asteroid.x + -PLAYAREA_WIDTH, asteroid.y,123, asteroidImage, asteroid.r);


      asteroidsClones.push(topLeft, top, topRight, right, bottomRight, bottom, bottomLeft, left);
    });
  }

  return asteroidsClones;
  
  

}