let config = require('../../configs/defaults.js');


function respawnAsteroid(asteroid, io) {
  updateAsteroidWithNewLocation(asteroid);
  let tempAsteroids = [];
  tempAsteroids.push(asteroid);
  io.sockets.emit("asteroids", tempAsteroids);
}

function updateAsteroidWithNewLocation(asteroid) {
  asteroid.x = Math.floor(Math.random() * (config.settings.PLAYAREA_WIDTH)) + 1;
  asteroid.y = Math.floor(Math.random() * (config.settings.PLAYAREA_HEIGHT)) + 1;
  asteroid.asteroidIndex  = Math.floor(Math.random() * config.settings.NUM_ASTEROID_IMAGES);
  asteroid.r = Math.floor(Math.random() * 300) + 50;
  asteroid.health = asteroid.r * 2;
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
