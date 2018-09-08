
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


  socket.on('playerDisconnected', playerDisconnected);
  socket.on('bullet', createNewBullet);
  socket.on('heartbeat',updateOtherPlayers);
  emitPlayerPosition();
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
    if (bullets[i].checkCollisionsWithPlayer(bullets, player, i)) {
      socket.emit('reduceShield');
    }
  }

  for (let i = asteroids.length-1; i >= 0; i--) {
    asteroids[i].updateAndDisplayAsteroid();
    asteroids[i].checkCollisionsWithPlayer(asteroids, player, i);
  }

  for (var i = asteroids.length-1; i >= 0; i--) {
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

  player.updateAndDisplayPlayer();

  for (var i = food.length-1; i >= 0; i--) {
    food[i].display();
    if (food[i].checkCollisionsWithPlayer(player, i)) {
       console.log("I just ate");
       socket.emit("increaseShield", food[i].r);
    }
  }

  emitPlayerAngle();
  drawOtherPlayers();

  // this needs to be done better
  if (player.shield <= 0) {
    console.log(player.shield);
    socket.emit('respawn');
  }
}

function emitPlayerAngle() {
  socket.emit('angle', player.radians);
}
function emitPlayerPosition() {
  let playerPosition = {
    x: player.pos.x,
    y: player.pos.y,
    angle: player.radians
  }

  socket.emit('player', playerPosition);
}



function createNewBullet(player) {
  let bullet = new Bullet(player.x, player.y, player.angle, true);
  bullets.push(bullet);
}

function updateOtherPlayers(data) {
  for (let i = 0; i < data.length; i++) {
    let exists = false;

    if (data[i].id == socket.id) {
      player.pos.x = data[i].x;
      player.pos.y = data[i].y;
      player.shield = data[i].shield;
      continue;
    }
    for (let j = 0; j < otherPlayers.length; j++) {
      if (data[i].id == otherPlayers[j].id) {
        otherPlayers[j] = data[i];
        exists = true;
      }
    }

    if (!exists) {
      otherPlayers.push(data[i]);
    }
  }

}

function playerDisconnected(socketId) {
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
    socket.emit('keyPressed', "up");
  } else if (keyCode == DOWN_ARROW || keyCode == 83) {
    socket.emit('keyPressed', "down");
  } else if (keyCode == LEFT_ARROW || keyCode == 65 ) {
    socket.emit('keyPressed', "left");
  } else if (keyCode == RIGHT_ARROW || keyCode == 68) {
    socket.emit('keyPressed', "right");
  }
}

function keyReleased() {
  if (keyCode == UP_ARROW || keyCode == 87) {
    socket.emit('keyReleased', "up");
  } else if (keyCode == DOWN_ARROW || keyCode == 83) {
    socket.emit('keyReleased', "down");
  } else if (keyCode == LEFT_ARROW || keyCode == 65) {
    socket.emit('keyReleased', "left");
  } else if (keyCode == RIGHT_ARROW || keyCode == 68) {
    socket.emit('keyReleased', "right");
  }
}

function mousePressed() {

  if (timeSinceLastShot > 20) {
    socket.emit('bullet');

    let bullet = new Bullet(player.pos.x, player.pos.y, player.radians, false);
    bullets.push(bullet);
    timeSinceLastShot = 0;
  }
}
