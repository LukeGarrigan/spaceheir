
var player;
var food = [];
var asteroids = [];
var asteroidCount = 40;
var foodCount = 400;
var shieldImage;
var bullets = [];

let otherPlayers = [];
let timeSinceLastShot = 0;
function setup() {

  createCanvas(window.innerWidth, window.innerHeight);
  player = new Player();
  shieldImage = loadImage("shield.png");
  socket = io.connect('http://localhost:4000');

  for (var i = 0; i < foodCount; i++) {
    food.push(new Food());
    food[i].setup();
  }

  for (var i = 0; i < asteroidCount; i++) {
    var pos = createVector(random(width*3), random(height*3));
    asteroids.push(new Asteroid(pos, 40, 60));
  }

  socket.on('player', updateOtherPlayers);
  socket.on('playerDisconnected', playerDisconnected);
  socket.on('shield', updatePlayerShield);
  socket.on('bullet', createNewBullet);
}


function draw() {
  background(0);
  image(shieldImage, width-80, 20, 23, 23);
  fill(255);
  text(floor(player.shield), width-54, 35);
  translate(width/2-player.pos.x, height/2-player.pos.y);
  timeSinceLastShot++;

  for (var i = bullets.length-1; i >= 0; i--) {
    bullets[i].updateAndDisplay();
    bullets[i].checkCollisionsWithPlayers(bullets, player, i);
  }

  for (let i = asteroids.length-1; i >= 0; i--) {
    asteroids[i].checkCollisionsWithPlayers(asteroids, player, i);
  }

  for (var i = asteroids.length-1; i >= 0; i--) {
    asteroids[i].update();
    asteroids[i].display();
    asteroids[i].constrain();

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

  let playerPosition = {
    x: player.pos.x,
    y: player.pos.y,
    angle: player.radians
  }

  socket.emit('player', playerPosition);
  drawOtherPlayers();
}



function updatePlayerShield(shield) {
  player.shield = shield.shield;
}

function createNewBullet(player) {
  // create this bullet and add to the list of bullets
  console.log("creating other player bullet");
  let bullet = new Bullet(player.x, player.y, player.angle, true);
  bullets.push(bullet);
}

function updateOtherPlayers(data) {
  let exists = false;
  for (let i = 0; i < otherPlayers.length; i++) {
    if (otherPlayers[i].id == data.id) {
      otherPlayers[i] = data;
      exists = true;
    }
  }
  if (!exists) {
    otherPlayers.push(data);
  }
}

function playerDisconnected(socketId) {
  console.log(socketId);
  for (let i = otherPlayers.length-1; i >= 0; i--) {
    if (otherPlayers[i].id == socketId) {
      console.log("Splicing " + socketId);
      otherPlayers.splice(i, 1);
    }
  }
}


function drawOtherPlayers() {

  for (let i = 0; i < otherPlayers.length; i++) {
    push();
    translate(otherPlayers[i].x, otherPlayers[i].y);
    fill(0);
    stroke(255);
    rotate(otherPlayers[i].angle + HALF_PI);
    triangle(-21, 21,  0, -21, 21, 21);
    pop();
  }
}



function keyPressed() {
  if (keyCode == UP_ARROW || keyCode == 87) {
    player.up();
  } else if (keyCode == DOWN_ARROW || keyCode == 83) {
    player.down();
  } else if (keyCode == LEFT_ARROW || keyCode == 65 ) {
    player.left();
  } else if (keyCode == RIGHT_ARROW || keyCode == 68) {
    player.right();
  }
}

function mousePressed() {

  if (timeSinceLastShot > 20) {
    console.log("mouse pressed");
    let playerPosition = {
      x: player.pos.x,
      y: player.pos.y,
      angle: player.radians
    }

    console.log(playerPosition);
    socket.emit('bullet', playerPosition);

    let bullet = new Bullet(player.pos.x, player.pos.y, player.radians, false);
    bullets.push(bullet);
    timeSinceLastShot = 0;
  }
}


function keyReleased() {
  if (keyCode == UP_ARROW || keyCode == 87) {
    player.upReleased();
  } else if (keyCode == DOWN_ARROW || keyCode == 83) {
    player.downReleased();
  } else if (keyCode == LEFT_ARROW || keyCode == 65) {
    player.leftReleased();
  } else if (keyCode == RIGHT_ARROW || keyCode == 68) {
    player.rightReleased();
  }
}
