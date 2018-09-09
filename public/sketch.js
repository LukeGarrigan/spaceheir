var player;
var food = [];
var asteroids = [];
var asteroidCount = 40;
var foodCount = 400;
var shieldImage;
var bullets = [];
var bulletIds = [];
let otherPlayers = [];
let timeSinceLastShot = 0;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  player = new Player();
  shieldImage = loadImage("shield.png");
  socket = io.connect('http://localhost:4000');
  console.log(width);

  for (var i = 0; i < foodCount; i++) {
    food.push(new Food());
    food[i].setup();
  }

  for (var i = 0; i < asteroidCount; i++) {
    var pos = createVector(random(1920 * 3), random(1080 * 3));
    asteroids.push(new Asteroid(pos, 40, 60));
  }


  socket.on('playerDisconnected', playerDisconnected);
  socket.on('heartbeat', updateOtherPlayers);
  socket.on('bullets', updateBullets);
  emitPlayerPosition();
}


function draw() {
  background(0);
  image(shieldImage, width - 80, 20, 23, 23);
  fill(255);
  text(floor(player.shield), width - 54, 35);
  translate(width / 2 - player.pos.x, height / 2 - player.pos.y);
  timeSinceLastShot++;

  for (var i = bullets.length - 1; i >= 0; i--) {
    bullets[i].updateAndDisplay();
    if (bullets[i].hasBulletDiminished()) {
      socket.emit('removeBullet', bullets[i].id);
      bullets.splice(i, 1);
    } else {
      if (bullets[i].checkCollisionsWithPlayer(bullets, player, i)) {
        socket.emit('reduceShield');
        socket.emit('removeBullet', bullets[i].id);
        bullets.splice(i, 1);
      }
    }
  }

  for (let i = asteroids.length - 1; i >= 0; i--) {
    asteroids[i].updateAndDisplayAsteroid();
    if (asteroids[i].checkCollisionsWithPlayer(asteroids, player, i)) {
      socket.emit('reduceShield');
    }
  }

  for (var i = asteroids.length - 1; i >= 0; i--) {
    for (var j = bullets.length - 1; j >= 0; j--) {
      if (bullets[j].hasHit(asteroids[i])) {
        if (asteroids[i].shouldCreateNewAsteroids()) {
          var newAsteroids = asteroids[i].getNewAsteroids();
          asteroids.push(...newAsteroids);
        }
        asteroids.splice(i, 1);
        socket.emit('removeBullet', bullets[j].id);
        bullets.splice(j, 1);
        break;
      }
    }
  }

  player.updateAndDisplayPlayer();

  for (var i = food.length - 1; i >= 0; i--) {
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


function updateOtherPlayers(data) {
  for (let i = 0; i < data.length; i++) {
    let exists = false;

    if (data[i].id == socket.id) {
      player.pos.x = data[i].x;
      player.pos.y = data[i].y;
      player.r = data[i].r;
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
  for (let i = otherPlayers.length - 1; i >= 0; i--) {
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
    triangle(-21, 21, 0, -21, 21, 21);
    pop();
  }
}



function keyPressed() {
  if (keyCode == UP_ARROW || keyCode == 87) {
    socket.emit('keyPressed', "up");
  } else if (keyCode == DOWN_ARROW || keyCode == 83) {
    socket.emit('keyPressed', "down");
  } else if (keyCode == LEFT_ARROW || keyCode == 65) {
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


function updateBullets(data) {
  for (let i = 0; i < data.length; i++) {

    let exists = false;
    for (let j = 0; j < bulletIds.length; j++) {
      if (data[i].id == bulletIds[j]) {
        exists = true;
        break;
      }
    }

    if (!exists) {
      console.log(data[i].clientId);
      let bullet = new Bullet(data[i].x, data[i].y, data[i].angle, data[i].clientId, data[i].id);
      bulletIds.push(data[i].id);
      bullets.push(bullet);
    }
  }

}



function mousePressed() {

  if (timeSinceLastShot > 20) {
    socket.emit('bullet');
    timeSinceLastShot = 0;
  }
}
