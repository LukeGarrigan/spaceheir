
export default function(asteroids) {
  for (let asteroid of asteroids) {
    if (asteroid.hasExploded) {
      asteroid.drawExplosion();
    }
    push();
    imageMode(CENTER);
    translate(asteroid.x, asteroid.y);
    rotate(radians(frameCount) / 4);
    image(asteroid.asteroidImage, 0, 0, asteroid.r, asteroid.r);
    pop();
  }
}