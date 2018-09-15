var player;
var food = [];
var asteroids = [];
var asteroidCount = 40;
var foodCount = 200;
var shieldImage;
var bullets = [];
var bulletIds = [];
let otherPlayers = [];
let timeSinceLastShot = 0;

let button, input;
let gameStarted = false;
let leaders = [];
let canvas;

let popups = [];

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  console.log(window.innerWidth);
  console.log(window.innerHeight);
  shieldImage = loadImage("shield.png");
  input = createInput();
  input.position(width / 2 - 250, height / 2);
  button = createButton("Play");
  button.position(width / 2 - 250, height / 2 + 80);
  button.mousePressed(setupGame);
}

function setupGame() {
  inputValue = input.value().replace(/[^\x00-\x7F]/g, "");
  if (inputValue.length >= 2 && inputValue.length < 15) {
    button.style("visibility", "hidden");
    input.style("visibility", "hidden");
    player = new Player(inputValue);
    socket = io.connect('http://localhost:4000');
    for (var i = 0; i < asteroidCount; i++) {
      var pos = createVector(random(1920 * 3), random(1080 * 3));
      asteroids.push(new Asteroid(pos, 40, 60));
    }
    socket.on('playerDisconnected', playerDisconnected);
    socket.on('heartbeat', updateOtherPlayers);
    socket.on('bullets', updateBullets);
    socket.on('foods', updateFoods);
    socket.on('bulletHit', removeBullet);
    socket.on('leaderboard', updateLeaderboard);
    socket.on('increaseShield', displayIncreasedShieldMessage)
    socket.on('respawn-start', timeOut => {
      player.respawning = true;
      console.log(player)
    })
    socket.on('respawn-end', () => {
      player.respawning = false;
    })
    gameStarted = true;
    emitPlayerPosition();
  }
}

function displayIncreasedShieldMessage(data) {
  console.log("Increase by " + data);
  let popup;
  if (data < 0) {
    popup = new DecreaseShield(data);
  } else {
    popup = new Popup(data);
  }
  popups.push(popup);
}

function draw() {
  background(0);
  image(shieldImage, width - 95, 20, 23, 23);
  fill(255);
  textSize(15);
  if (gameStarted) {
    text(floor(player.shield), width - 54, 35);
    text("X: " + floor(player.pos.x), width - 100, height - 100);
    text("Y: " + floor(player.pos.y), width - 100, height - 75);
    translate(width / 2 - player.pos.x, height / 2 - player.pos.y);
    timeSinceLastShot++;

    for (var i = bullets.length - 1; i >= 0; i--) {
      bullets[i].updateAndDisplay();
      if (bullets[i].hasBulletDiminished()) {
        socket.emit('removeBullet', bullets[i].id);
        bullets.splice(i, 1);
      }
    }

    for (let i = asteroids.length - 1; i >= 0; i--) {
      asteroids[i].updateAndDisplayAsteroid();
      if (asteroids[i].checkCollisionsWithPlayer(asteroids, player, i)) {
        socket.emit('reduceShield');
        displayIncreasedShieldMessage(-75)
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
          bullets.splice(j, 1);
          break;
        }
      }
    }

    player.updateAndDisplayPlayer(leaders);

    if (popups.length > 0) {
      for (let i = popups.length - 1; i >= 0; i--) {

        popups[i].update();
        popups[i].display();

        if (!popups[i].isVisible) {
          popups.splice(i, 1);
        }
      }



    }

    for (var i = food.length - 1; i >= 0; i--) {
      food[i].display();
    }

    emitPlayerAngle();
    drawOtherPlayers();
    emitPlayersBullets();
    drawLeaders();

  }

}

function updateLeaderboard(leaderboard) {
  leaders = leaderboard;
}

function drawLeaders() {
  for (let i = 0; i < leaders.length && i < 10; i++) {
    push();
    textAlign(LEFT);
    text(leaders[i].name + " : " + leaders[i].score, player.pos.x - width / 2 + 25, player.pos.y - height / 2 + 50 + i * 20);
    pop();
  }
}

function emitPlayerAngle() {
  socket.emit('angle', player.radians);
}

function emitPlayersBullets() {
  let myBullets = [];
  for (let i = 0; i < bullets.length; i++) {
    if (bullets[i].shooterId == socket.id) {
      let bullet = {
        id: bullets[i].id,
        x: bullets[i].pos.x,
        y: bullets[i].pos.y
      };
      myBullets.push(bullet);
    }
  }
  socket.emit('playerBullets', myBullets);


}

function emitPlayerPosition() {
  let playerPosition = {
    x: player.pos.x,
    y: player.pos.y,
    angle: player.radians,
    name: player.name
  }

  console.log(playerPosition);
  socket.emit('player', playerPosition);
}


function updateOtherPlayers(data) {
  for (let i = 0; i < data.length; i++) {
    let exists = false;

    if (data[i].id == socket.id) {
      player.pos.x = data[i].x;
      player.pos.y = data[i].y;
      player.r = data[i].r;
      player.name = data[i].name;
      player.shield = data[i].shield;
      player.score = data[i].score;
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
      otherPlayers.splice(i, 1);
    }
  }
}


function drawOtherPlayers() {

  let leaderBoardWinnersId;
  if (leaders.length > 0) {
    leaderBoardWinnersId = leaders[0].id;
  }
  for (let i = 0; i < otherPlayers.length; i++) {
    push();
    translate(otherPlayers[i].x, otherPlayers[i].y);
    fill(0);
    if (leaderBoardWinnersId == otherPlayers[i].id) {
      stroke(255, 0, 0);
    } else {
      stroke(255);
    }
    rotate(otherPlayers[i].angle + HALF_PI);
    triangle(-21, 21, 0, -21, 21, 21);
    pop();
    textAlign(CENTER);
    let name = otherPlayers[i].name
    if (otherPlayers[i].lastDeath !== null) {
      name += ' [respawning...]'
    }
    text(name, otherPlayers[i].x, otherPlayers[i].y + 49);
  }
}



function keyPressed() {
  console.log(keyCode);
  if (gameStarted) {
    if (keyCode == UP_ARROW || keyCode == 87) {
      socket.emit('keyPressed', "up");
    } else if (keyCode == DOWN_ARROW || keyCode == 83) {
      socket.emit('keyPressed', "down");
    } else if (keyCode == LEFT_ARROW || keyCode == 65) {
      socket.emit('keyPressed', "left");
    } else if (keyCode == RIGHT_ARROW || keyCode == 68) {
      socket.emit('keyPressed', "right");
    } else if (keyCode == 32) {
      socket.emit('keyPressed', "spacebar");
    }
  }

}

function keyReleased() {
  if (gameStarted) {
    if (keyCode == UP_ARROW || keyCode == 87) {
      socket.emit('keyReleased', "up");
    } else if (keyCode == DOWN_ARROW || keyCode == 83) {
      socket.emit('keyReleased', "down");
    } else if (keyCode == LEFT_ARROW || keyCode == 65) {
      socket.emit('keyReleased', "left");
    } else if (keyCode == RIGHT_ARROW || keyCode == 68) {
      socket.emit('keyReleased', "right");
    } else if (keyCode == 32) {
      socket.emit('keyReleased', "spacebar");
    }
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
      let bullet = new Bullet(data[i].x, data[i].y, data[i].angle, data[i].clientId, data[i].id);
      bulletIds.push(data[i].id);
      bullets.push(bullet);
    }
  }

}

function updateFoods(data) {
  for (let i = 0; i < data.length; i++) {
    let exists = false;
    for (let j = 0; j < food.length; j++) {
      if (data[i].id == food[j].id) {
        exists = true;
        if (data[i].x !== food[j].x || data[i].y !== food[j].y) {
          food[j].x = data[i].x;
          food[j].y = data[i].y;
        }
      }
    }
    if (!exists) {
      let aFood = new Food(data[i].x, data[i].y, data[i].r, data[i].id);
      food.push(aFood);
    }



  }

}

window.onresize = function () {
  console.log("I JUST RESIZED");
  console.log(canvas);
  canvas.size(window.innerWidth, window.innerHeight);
}

function mousePressed() {

  if (timeSinceLastShot > 20) {
    socket.emit('bullet');
    timeSinceLastShot = 0;
  }
}


function removeBullet(id) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].id == id) {
      bullets.splice(i, 1);
      break;
    }
  }

}
