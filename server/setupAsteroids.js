let config = require('../configs/defaults.js');
module.exports = function() {

  let asteroids = [];
  for (let i = 0; i < config.settings.NUM_ASTEROIDS; i++) {
    let asteroidX = Math.floor(Math.random() * (config.settings.PLAYAREA_WIDTH - 700)) + 700;
    let asteroidY = Math.floor(Math.random() * (config.settings.PLAYAREA_HEIGHT - 600)) + 600;
    let asteroidIndex = Math.floor(Math.random() * config.settings.NUM_ASTEROID_IMAGES);
    let asteroidRadius = Math.floor(Math.random() * 300) + 50;

    let asteroid = {
      x: asteroidX,
      y: asteroidY,
      id: i,
      health: asteroidRadius * 2,
      asteroidIndex: asteroidIndex,
      r: asteroidRadius
    };

    asteroids.push(asteroid);
  }
  return asteroids;
};
