let config = require('../../configs/defaults.js');


function respawnAsteroid(asteroid, io) {
  let asteroidX = Math.floor(Math.random() * (config.settings.PLAYAREA_WIDTH)) + 1;
  let asteroidY = Math.floor(Math.random() * (config.settings.PLAYAREA_HEIGHT)) + 1;
  let asteroidIndex = Math.floor(Math.random() * config.settings.NUM_ASTEROID_IMAGES);
  let asteroidRadius = Math.floor(Math.random() * 300) + 50;


  asteroid.x = asteroidX;
  asteroid.y = asteroidY;
  asteroid.asteroidIndex = asteroidIndex;
  asteroid.r = asteroidRadius;
  asteroid.health = asteroidRadius * 2;

  let tempAsteroids = [];

  tempAsteroids.push(asteroid);

  io.sockets.emit("asteroids", tempAsteroids);
}

function processPlayerHittingAsteroid(player, asteroids) {
  for (let asteroid of asteroids) {
    if (Math.abs(asteroid.x - player.x) + Math.abs(asteroid.y - player.y) < asteroid.r / 2) {
      player.shield -= 1;
    }
  }
}


module.exports = {
  respawnAsteroid,
  processPlayerHittingAsteroid
};
