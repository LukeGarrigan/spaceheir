import Asteroid from './Asteroid/Asteroid.js';
import Player from './Player/Player.js';
import socket from './socket.js';
import HitMarker from './Hitmarker/Hitmarker.js';
import Killfeed from './Killfeed/Killfeed.js';
import Leaderboard from './Leaderboard/Leaderboard.js';
import {
  processRespawn,
  emitPlayersBullets,
  playerDisconnected,
  displayIncreasedShieldMessage,
  updateOtherPlayers,
  updateBullets,
  updateFoods,
  removeBullet,
  processHitmarker,
  processKillFeedAddition,
  isWithinScreen
} from './game-logic.js'



let player;
let food = [];
let asteroids = [];
let asteroidCount = 0;
let shieldImage;
let bullets = [];
let bulletIds = [];
let otherPlayers = [];
let timeSinceLastShot = 0;

let button, input;
let gameStarted = false;
let leaders = [];
let canvas;

let popups = [];
let hitMarker;
let hitMarkerImage;
let hitMarkerSound;
let boostSound;
let shotSound;
let explosionSound;
let killfeed;
let leaderboard;
socket.on('foods', data => updateFoods(data, food));

window.preload = function() {
  boostSound = loadSound('assets/sounds/boost.wav');
  boostSound.setLoop(true);
  shotSound = loadSound('assets/sounds/shot.wav');
  explosionSound = loadSound('assets/sounds/explode1.wav');
  shieldImage = loadImage("assets/images/shield.png");
  hitMarkerImage = loadImage("assets/images/hitmarker.png");
  hitMarkerSound = loadSound("assets/sounds/hitmarker.mp3");
  shotSound.setVolume(0.05)
  explosionSound.setVolume(0.4);
}

window.setup = function () {
  background(0);
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  input = createInput();
  input.position(window.innerWidth / 2 - 250, window.innerHeight / 2);
  button = createButton("Play");
  button.position(window.innerWidth / 2 - 250, window.innerHeight / 2 + 80);
  button.mousePressed(function () {
    let inputValue = input.value().replace(/[^\x00-\x7F]/g, "");
    if (inputValue.length >= 2 && inputValue.length < 15) {
      button.style("visibility", "hidden");
      input.style("visibility", "hidden");
      player = new Player(inputValue);
      hitMarker = new HitMarker();
      killfeed = new Killfeed();
      leaderboard = new Leaderboard(player, leaders);
      for (let i = 0; i < asteroidCount; i++) {
        let pos = createVector(random(1920 * 3), random(1080 * 3));
        asteroids.push(new Asteroid(pos, 40, 60));
      }
      socket.on('playerDisconnected', id => playerDisconnected(id, otherPlayers));
      socket.on('heartbeat', data => updateOtherPlayers(data, player, otherPlayers));
      socket.on('bullets', data => updateBullets(data, bulletIds, bullets));
      socket.on('bulletHit', bullet => removeBullet(bullet, bullets));
      socket.on('leaderboard', leaderboard => leaders = leaderboard);
      socket.on('increaseShield', data => displayIncreasedShieldMessage(data, popups, player));
      socket.on('respawn-start', timeOut => processRespawn(player, popups, timeOut));
      socket.on('respawn-end', () => player.respawning = false);
      socket.on('playExplosion', () => explosionSound.play());
      socket.on('hitMarker', player => hitMarker = processHitmarker(player, hitMarkerImage, hitMarkerSound));
      socket.on('killfeed', data => processKillFeedAddition(data, killfeed));
      socket.on('processShotSound',() => shotSound.play());

      gameStarted = true;
      let playerPosition = {
        x: player.pos.x,
        y: player.pos.y,
        angle: player.radians,
        name: player.name
      };

      socket.emit('player', playerPosition);
    }
  });
};


window.mouseWheel = function(event) {
  return false;
;}

window.draw = function() {
  background(0);
  fill(255);
  scale(1);
  textSize(15);
  if (gameStarted) {


    text("X: " + floor(player.pos.x), width - 100, height - 100);
    text("Y: " + floor(player.pos.y), width - 100, height - 75);
    translate(width / 2 - player.pos.x, height / 2 - player.pos.y);
    image(shieldImage, player.pos.x - width / 2 + 25, player.pos.y + height /3, 40, 40);
    text(floor(player.shield), player.pos.x - width / 2 + 80, player.pos.y + height /3 + 25);
    timeSinceLastShot++;

    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].update();
      if (isWithinScreen(player, bullets[i].pos)) {
        bullets[i].display();
      }
      if (bullets[i].hasBulletDiminished()) {
        socket.emit('removeBullet', bullets[i].id);
        bullets.splice(i, 1);
      }
    }

    player.display(leaders);
    if (player.shield <= 0) { // This should be somewhere more sensible.
      boostSound.stop();
    }

    for (let i = popups.length - 1; i >= 0; i--) {

      popups[i].update();
      popups[i].display();

      if (!popups[i].isVisible) {
        popups.splice(i, 1);
      }
    }

    for (let i = food.length - 1; i >= 0; i--) {
      if (isWithinScreen(player, food[i])) {
        food[i].move();
        food[i].displayFood();
      }
    }

    socket.emit('angle', player.radians);

    let leaderBoardWinnersId;
    if (leaders.length > 0) {
      leaderBoardWinnersId = leaders[0].id;
    }
    for (const otherPlayer of otherPlayers) {
      if (isWithinScreen(player, otherPlayer)) {
        Player.drawOtherPlayer(otherPlayer, leaderBoardWinnersId);
      }
    }

    hitMarker.display();
    emitPlayersBullets(bullets);

    killfeed.display(player.pos);
    leaderboard.updateLeaderboard(player, leaders);
    leaderboard.displayLeaderboard();
  }
}

window.keyPressed = function() {
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
      if (player.shield > 0) {
        boostSound.play();
        player.isBoosting = true;
      }
    }
  }

}

window.keyReleased = function() {
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
      boostSound.stop();
      player.isBoosting = false;
    }
  }
}

window.onresize = function() {
  background(0);
  canvas.size(window.innerWidth, window.innerHeight);
  if (!gameStarted) {
    input.position(window.innerWidth / 2 - 250, window.innerHeight / 2);
    button.position(window.innerWidth / 2 - 250, window.innerHeight / 2 + 80);
  }
}

window.mousePressed = function() {
  if (timeSinceLastShot > 15 && !player.respawning) {
    socket.emit('bullet');
    timeSinceLastShot = 0;
  }
};

