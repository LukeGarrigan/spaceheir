let config = require('../configs/defaults.js')

module.exports = function() {
  let foods = [];
  for (let i = 0; i < config.NUM_FOOD; i++) {
    let foodX = Math.floor(Math.random() * (config.PLAYAREA_WIDTH)) + 1;
    let foodY = Math.floor(Math.random() * (config.PLAYAREA_HEIGHT)) + 1;
    let foodRadius = Math.floor(Math.random() * 22) + 15;

    let food = {
      x: foodX,
      y: foodY,
      r: foodRadius,
      id: i
    };
    foods.push(food);
  }

  return foods;
};

