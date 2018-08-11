
var player;
var food = [];
var asteroids = [];
var asteroidCount = 40;
var foodCount = 400;
var shieldImage;
var bullets = [];

function setup() {
  createCanvas(700,500);
  player = new Player();
  shieldImage = loadImage("shield.png");

  for (var i = 0; i < foodCount; i++) {
    food.push(new Food());
    food[i].setup();
  }

  for (var i = 0; i < asteroidCount; i++) {
    var pos = createVector(random(width*3), random(height*3));
    asteroids.push(new Asteroid(pos, 40, 60));
  }
}


function draw() {
  background(0);
  image(shieldImage, width-80, 20, 23, 23);
  fill(255);
  text(floor(player.shield), width-54, 35);
  translate(width/2-player.pos.x, height/2-player.pos.y);

  for (var i = bullets.length-1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].display();
    if (bullets[i].shouldBeDestroyed()) {
      bullets.splice(i, 1);
    }
  }

  for (var i = asteroids.length-1; i >= 0; i--) {
    asteroids[i].update();
    asteroids[i].display();
    asteroids[i].constrain();
    if (asteroids[i].hasHitPlayer(player)) {
      player.reduceShield();
      if (asteroids[i].shouldCreateNewAsteroids()) {
        var newAsteroids = asteroids[i].getNewAsteroids();
        asteroids.push(...newAsteroids);
      }
      asteroids.splice(i, 1);
      continue;
    }

    for (var j = bullets.length-1; j >= 0; j--) {
      if (bullets[j].hasHit(asteroids[i])) {
        if (asteroids[i].shouldCreateNewAsteroids()) {
          var newAsteroids = asteroids[i].getNewAsteroids();
          asteroids.push(...newAsteroids);
        }
        asteroids.splice(i, 1);
        bullets.splice(j, 1);
        break;
      }
    }
  }


  player.update();
  player.display();
  player.constrain();

  for (var i = food.length-1; i >= 0; i--) {
    food[i].display();
    if (food[i].hasBeenEaten(player)) {
      food[i].resetPosition();
      player.increaseShield(food[i].r);
    }
  }

  // processAsteroidsColliding();



}


// function processAsteroidsColliding() {
//   for (var i = asteroids.length-1; i >= 0; i--) {
//
//     for (var j = i-1; j >= 0; j--) {
//         if(asteroids[i].hasCollided(asteroids[j])) {
//           if (asteroids[i].shouldCreateNewAsteroids()) {
//             var newAsteroids = asteroids[i].getNewAsteroids();
//             asteroids.push(...newAsteroids);
//           }
//           asteroids.splice(i, 1);
//
//           // if (asteroids[j].shouldCreateNewAsteroids()) {
//           //   var newAsteroids = asteroids[j].getNewAsteroids();
//           //   asteroids.push(...newAsteroids);
//           // }
//           //
//           // asteroids.splice(j, 1);
//           break;
//         }
//     }
//
//   }
//
// }


function keyPressed() {
  if (keyCode == UP_ARROW) {
    player.up();
  } else if (keyCode == DOWN_ARROW) {
    player.down();
  } else if (keyCode == LEFT_ARROW) {
    player.left();
  } else if (keyCode == RIGHT_ARROW) {
    player.right();
  }
}

function mousePressed() {
  bullets.push(new Bullet(player.pos, player.radians));
}


function keyReleased() {
  if (keyCode == UP_ARROW) {
    player.upReleased();
  } else if (keyCode == DOWN_ARROW) {
    player.downReleased();
  } else if (keyCode == LEFT_ARROW) {
    player.leftReleased();
  } else if (keyCode == RIGHT_ARROW) {
    player.rightReleased();
  }
}
