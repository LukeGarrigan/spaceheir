import Player from './Player/Player.js';
import socket from './socket.js';
import HitMarker from './Hitmarker/Hitmarker.js';
import Killfeed from './Killfeed/Killfeed.js';
import Leaderboard from './Leaderboard/Leaderboard.js';
import WinnerLocation from './WinnerLocation/WinnerLocation.js';
import Healthbar from "./Healthbar/Healthbar.js";
import Minimap from "./Minimap/Minimap.js";
import MuteButton from "./MuteButton/MuteButton.js";



import {
  displayIncreasedShieldMessage,
  isWithinScreen,
  playerDisconnected,
  processHitmarker,
  processKillFeedAddition,
  processRespawn,
  removeBullet,
  updateBullets,
  updateFoods,
  updateAsteroids,
  updateOtherPlayers,
  createXpGems,
} from './game-logic.js'


let player;
let food = [];
let asteroids = [];
let asteroidImages = [];
let bullets = [];
let bulletIds = [];
let otherPlayers = [];
let button, input;
let gameStarted = false;
let leaders = [];
let canvas;
let xpGems = [];
let popups = [];
let hitMarker;
let hitMarkerImage;
let hitMarkerSound;
let shotSound;
let explosionSound;
let killfeed;
let leaderboard;
let winnerLocation;
let indicatorImage;
let foodImage;
let lastLoop = new Date();
let frameRate;
let spaceShipImage;
let winnerSpaceShipImage;
let healthbar;
let leaderBoardWinnersId;
let minimap;
let soundOn;
let soundOff;
let muteButton;
let space;
let gemImage;
socket.on('foods', data => updateFoods(data, food, foodImage));


socket.on('asteroids' , data => updateAsteroids(data, asteroids, asteroidImages));


function loadImages() {
  hitMarkerImage = loadImage("assets/images/hitmarker.png");
  indicatorImage = loadImage("assets/images/indicator.png");
  foodImage = loadImage("assets/images/food.png");
  spaceShipImage = loadImage("assets/images/spaceship.png");
  winnerSpaceShipImage = loadImage("assets/images/winner.png");
  soundOn = loadImage("assets/images/soundOn.png");
  soundOff = loadImage("assets/images/soundOff.png");
  gemImage = loadImage("assets/images/gem.png");
  space = loadImage("assets/images/space.png");

  let asteroidGreyImage= loadImage("assets/images/asteroidGrey.png");
  let asteroidGreyImage1 = loadImage("assets/images/asteroidGrey1.png");
  let asteroidGreyImage2= loadImage("assets/images/asteroidGrey2.png");

  let asteroidOrangeImage = loadImage("assets/images/asteroidOrange.png");


  asteroidImages.push(asteroidGreyImage, asteroidGreyImage1, asteroidGreyImage2, asteroidOrangeImage);
}

function loadSounds() {
  shotSound = loadSound('assets/sounds/shot.wav');
  explosionSound = loadSound('assets/sounds/explode1.wav');
  hitMarkerSound = loadSound("assets/sounds/hitmarker.mp3");
  shotSound.setVolume(0.01);
  explosionSound.setVolume(0.2);
}

window.setup = function () {
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
      player = new Player(inputValue, spaceShipImage, winnerSpaceShipImage);
      hitMarker = new HitMarker();
      killfeed = new Killfeed();
      leaderboard = new Leaderboard(player, leaders);
      winnerLocation = new WinnerLocation(indicatorImage);
      healthbar = new Healthbar();
      minimap = new Minimap();
      muteButton = new MuteButton(soundOn, soundOff);

      let playerPosition = {
        x: player.pos.x,
        y: player.pos.y,
        angle: player.radians,
        name: player.name
      };
      socket.emit('player', playerPosition);
    }
  });


  socket.on('playerDisconnected', id => playerDisconnected(id, otherPlayers));
  socket.on('heartbeat', data => updateOtherPlayers(data, player, otherPlayers));
  socket.on('bullets', data => updateBullets(data, bulletIds, bullets));
  socket.on('bulletHit', bullet => removeBullet(bullet, bullets));
  socket.on('leaderboard', leaderboard => leaders = leaderboard);
  socket.on('increaseShield', data => displayIncreasedShieldMessage(data, popups, player));
  socket.on('respawn-start', timeOut => processRespawn(player, popups, timeOut));
  socket.on('respawn-end', () => player.respawning = false);
  socket.on('playExplosion', () => {
    if (!muteButton.isMuted) {
      explosionSound.play()
    }
  });
  socket.on('hitMarker', player => hitMarker = processHitmarker(player, hitMarkerImage, hitMarkerSound, muteButton.isMuted));
  socket.on('killfeed', data => processKillFeedAddition(data, killfeed));
  socket.on('processShotSound', () =>  {
    if (!muteButton.isMuted) {
      shotSound.play();
    }
  });
  socket.on('createXpGem', gems => xpGems.push(...createXpGems(gems, gemImage)));
  socket.on('removeXpGem', gemId => xpGems = xpGems.filter(gem => gem.id !== gemId));


  gameStarted = true;

  loadSounds();
  loadImages();
};


window.mouseWheel = function (event) {
  return false;
};

function displayCurrentWinnerLocation() {
  if (otherPlayers.length > 0) {
    let currentWinner = findCurrentWinner();
    if (currentWinner && currentWinner.id !== player.id) {
      winnerLocation.drawWinnerLocation(player.x, player.y, currentWinner.x, currentWinner.y);
    }
  }
}



window.draw = function () {
  background(0);
  fill(255);
  scale(1);
  textSize(15);
  if (gameStarted && player) {
    addParallaxScrolling(player.pos.x, player.pos.y);

    displayFramesPerSecond();
    text("X: " + floor(player.pos.x), width - 100, height - 100);
    text("Y: " + floor(player.pos.y), width - 100, height - 75);
    translate(width / 2 - player.pos.x, height / 2 - player.pos.y);
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
    for (let i = popups.length - 1; i >= 0; i--) {
      popups[i].update();
      popups[i].display();
      if (!popups[i].isVisible) {
        popups.splice(i, 1);
      }
    }


    drawFood(player);

    socket.emit('angle', player.radians);

    drawOtherPlayers(player, leaderBoardWinnersId);

    killfeed.displayKillfeed(player.pos, spaceShipImage, winnerSpaceShipImage);
    leaderboard.updateLeaderboard(player, leaders);
    leaderboard.displayLeaderboard();
    displayCurrentWinnerLocation();
    healthbar.displayHealthbar(player);
    minimap.displayMinimap(player.pos.x, player.pos.y, player.radians, food);
    muteButton.displayMuteButton(player.pos.x - width/2, player.pos.y - height/2);
    if (mouseIsPressed && mouseButton === LEFT) {
      processPlayerShooting();
    }

    drawAsteroids();
    drawXpGems();
    hitMarker.display();


    let totalAsteroidShell = 0;
    for (let asteroid of asteroids) {
      totalAsteroidShell += asteroid.particles.length;
    }

  } else {
    drawStartScreen();
  }
};


function drawStartScreen() {
  let position = {
    x: 1000,
    y: 500
  };

  addParallaxScrolling(position.x, position.y);
  drawFood(position);
  drawOtherPlayers(position);

}


function drawFood(currentPosition) {
  for (let i = food.length - 1; i >= 0; i--) {
    if (isWithinScreen(currentPosition, food[i])) {
      food[i].move();
      food[i].displayFood();
    }
  }
}

function drawOtherPlayers(currentPosition) {
  for (const otherPlayer of otherPlayers) {
    if (isWithinScreen(currentPosition, otherPlayer)) {
      if (leaders.length > 0) {
        leaderBoardWinnersId = leaders[0].id;
      }
      Player.drawOtherPlayer(otherPlayer, leaderBoardWinnersId, spaceShipImage, winnerSpaceShipImage);
    }
  }
}


function displayFramesPerSecond() {
  let thisLoop = new Date();
  let fps = 1000 / (thisLoop - lastLoop);
  lastLoop = thisLoop;

  if (frameCount % 15 === 0) {
    frameRate = fps;
  }
  text("FPS: " + floor(frameRate), width - 100, height - 50);

}


function findCurrentWinner() {
  let winnerId = leaderboard.leaders[0].id;
  for (const player of otherPlayers) {
    if (player.id === winnerId) {
      return player;
    }
  }
}


window.oncontextmenu = function (e) {
  e.preventDefault();
};


window.keyPressed = function () {
  if (gameStarted) {
    if (keyCode == UP_ARROW || keyCode == 87) {
      socket.emit('keyPressed', "up");
    }else if (keyCode === DOWN_ARROW || keyCode === 83) {
      socket.emit('keyPressed', "down");
    }
  }
};

window.keyReleased = function () {
  if (gameStarted) {
    console.log(keyCode);
    if (keyCode === UP_ARROW || keyCode === 87) {
      socket.emit('keyReleased', "up");
    } else if (keyCode === DOWN_ARROW || keyCode === 83) {
      socket.emit('keyReleased', "down");
    }
  }
};

window.onresize = function () {
  background(0);
  canvas.size(window.innerWidth, window.innerHeight);
  input.position(window.innerWidth / 2 - 250, window.innerHeight / 2);
  button.position(window.innerWidth / 2 - 250, window.innerHeight / 2 + 80);
};


window.mousePressed = function () {
  if (mouseButton === LEFT) {
    checkMuteToggled();
    processPlayerShooting();
  } else {
    socket.emit('keyPressed', "up");
  }
};

window.mouseReleased = function() {
  if (mouseButton === RIGHT) {
    socket.emit('keyReleased', "up");
  }
};

function processPlayerShooting() {
 socket.emit('bullet');
}

function checkMuteToggled() {
  if(muteButton) {
    muteButton.checkIfClicked(mouseX, mouseY);
  }
}

function addParallaxScrolling(x, y) {
// first Hlayer

  image(space, -(x / 10), -(y / 10));
  image(space, space.width - (x / 10), -(y / 10));
  image(space, space.width * 2 - (x / 10), -(y / 10));

  // second Hlayer
  image(space, -(x / 10), space.height - (y / 10));
  image(space, space.width - (x / 10), space.height - (y / 10));
  image(space, space.width * 2 - (x / 10), space.height - (y / 10));

  // third HLayer
  image(space, -(x / 10), space.height * 2 - (y / 10));
  image(space, space.width - (x / 10), space.height * 2 - (y / 10));
  image(space, space.width * 2 - (x / 10), space.height * 2 - (y / 10));
}


function drawAsteroids() {
  for (let asteroid of asteroids) {
    if (asteroid.hasExploded) {
      asteroid.drawExplosion();
    }
    push();
    imageMode(CENTER);
    translate(asteroid.x, asteroid.y);
    rotate(radians(frameCount)/4);
    image(asteroid.asteroidImage, 0, 0, asteroid.r, asteroid.r);
    pop();
  }
}

function drawXpGems() {
  for (let gem of xpGems) {
    gem.display();
  }
}

