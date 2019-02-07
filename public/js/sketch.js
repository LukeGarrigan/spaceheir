import Player from './Player/Player.js';
import socket from './socket.js';
import HitMarker from './Hitmarker/Hitmarker.js';
import Killfeed from './Killfeed/Killfeed.js';
import Leaderboard from './Leaderboard/Leaderboard.js';
import WinnerLocation from './WinnerLocation/WinnerLocation.js';
import XpBar from "./XpBar/XpBar.js";
import Minimap from "./Minimap/Minimap.js";
import MuteButton from "./MuteButton/MuteButton.js";

import SpeedLevelOption from "./LevelOptions/SpeedLevelOption.js";
import DamageLevelOption from "./LevelOptions/DamageLevelOption.js";
import RegenLevelOption from "./LevelOptions/RegenLevelOption.js";
import parallaxScrolling from "./Display/parallaxScrolling.js";
import drawAsteroids from "./Display/drawAsteroids.js";
import displayCurrentWinnerLocation from "./Display/displayCurrentWinnerLocation.js";
import displayFramesPerSecond from "./Display/displayFramesPerSecond.js";
import drawXAndY from "./Display/drawXAndY.js";
import drawXpGems from "./Display/drawXpGems.js";
import drawFood from "./Display/drawFood.js";
import drawBullets from "./Display/drawBullets.js";
import drawPopups from "./Display/drawPopups.js";


import {
  createXpGems,
  displayIncreasedShieldMessage,
  isWithinScreen,
  playerDisconnected,
  processHitmarker,
  processKillFeedAddition,
  processRespawn,
  removeBullet,
  removeXpGem,
  updateAsteroids,
  updateBullets,
  updateFoods,
  updateOtherPlayers,
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

let spaceShipImage;
let winnerSpaceShipImage;
let leaderBoardWinnersId;
let minimap;
let soundOn;
let soundOff;
let muteButton;
let space;
let gemImage;

let playerLevelUpPoints = 0;
let xpBar;

let speedImage;
let damageImage;
let regenImage;
let transparentDamageImage;
let transparentSpeedImage;
let transparentRegenImage;


let speedOption;
let damageOption;
let regenOption;

socket.on('foods', data => updateFoods(data, food, foodImage));
socket.on('asteroids', data => updateAsteroids(data, asteroids, asteroidImages));


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

  speedImage = loadImage("assets/images/speed.png");
  damageImage = loadImage("assets/images/damage.png");
  regenImage = loadImage("assets/images/regen.png");
  transparentDamageImage = loadImage("assets/images/damageTransparent.png");
  transparentRegenImage = loadImage("assets/images/regenTransparent.png");
  transparentSpeedImage = loadImage("assets/images/speedTransparent.png");
  let asteroidGreyImage = loadImage("assets/images/asteroidGrey.png");
  let asteroidGreyImage1 = loadImage("assets/images/asteroidGrey1.png");
  let asteroidGreyImage2 = loadImage("assets/images/asteroidGrey2.png");
  let asteroidOrangeImage = loadImage("assets/images/asteroidOrange.png");


  asteroidImages.push(asteroidGreyImage, asteroidGreyImage1, asteroidGreyImage2, asteroidOrangeImage);
}

function loadSounds() {
    shotSound = new Howl({
        src: ['assets/sounds/shot.wav'],
        volume: 0.05

    });

    explosionSound = new Howl({
        src: ['assets/sounds/explode1.wav'],
        volume: 0.2
    });
    hitMarkerSound = new Howl({
        src: ['assets/sounds/hitmarker.mp3'],
        volume: 0.5
    });
}

window.setup = function () {

  canvas = createCanvas(window.innerWidth, window.innerHeight);
  input = createInput().attribute('placeholder', 'username');

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
      minimap = new Minimap();
      muteButton = new MuteButton(soundOn, soundOff);


      speedOption = new SpeedLevelOption(speedImage, transparentSpeedImage);
      damageOption = new DamageLevelOption(damageImage, transparentDamageImage);
      regenOption = new RegenLevelOption(regenImage, transparentRegenImage);

      xpBar = new XpBar();

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
  socket.on('processShotSound', () => {
    if (!muteButton.isMuted) {
      shotSound.play();
    }
  });
  socket.on('createXpGem', gems => xpGems.push(...createXpGems(gems, gemImage)));
  socket.on('removeXpGem', gemId => removeXpGem(gemId, xpGems, popups));
  socket.on('leveledUp', () => playerLevelUpPoints += 1);


  gameStarted = true;

  loadSounds();
  loadImages();

};


window.mouseWheel = function (event) {
  return false;
};


window.draw = function () {
  background(0);
  fill(255);
  scale(1);
  textSize(15);

  if (gameStarted && player) {
    parallaxScrolling(player.x, player.y, space);
    translate(width / 2 - player.pos.x, height / 2 - player.pos.y);
    drawBullets(bullets, player);
    player.display(leaders);
    drawPopups(popups);
    drawFood(player, food);
    drawOtherPlayers(player, leaderBoardWinnersId);
    leaderboard.updateLeaderboard(player, leaders);
    displayCurrentWinnerLocation(otherPlayers, player, winnerLocation, leaderboard);

    if (mouseIsPressed && mouseButton === LEFT) {
      processPlayerShooting();
    }

    drawAsteroids(asteroids);

    drawXpGems(player, xpGems);


    minimap.displayMinimap(player.pos.x, player.pos.y, player.radians, food);
    muteButton.displayMuteButton(player.pos.x - width / 2, player.pos.y - height / 2);


    hitMarker.display();
    killfeed.displayKillfeed(player.pos, spaceShipImage, winnerSpaceShipImage);
    leaderboard.displayLeaderboard();

    xpBar.display(player);
    drawLevelUpButtons();
    socket.emit('angle', player.radians);
    clientLogging();
    drawXAndY(player.pos.x, player.pos.y);
    displayFramesPerSecond(player.pos.x, player.pos.y);
  } else {
    drawStartScreen();
  }
};


function drawLevelUpButtons() {

  let middleX = player.pos.x - width / 2;
  let middleY = player.pos.y - height / 2;
  speedOption.display(middleX, middleY , playerLevelUpPoints, player.additionalSpeed);
  damageOption.display(middleX, middleY, playerLevelUpPoints, player.damage);
  regenOption.display(middleX, middleY, playerLevelUpPoints, player.regen);

  if (playerLevelUpPoints > 0 ) {
    middleY  = middleY + windowHeight / 3.4 + height / 2;
    middleX = middleX + windowWidth / 2;

    push();
    fill(0, 255, 0);
    text(`Points available ${playerLevelUpPoints}`, middleX, middleY + 80);
    pop();
  }


}

function drawStartScreen() {
  let position = {
    x: 1000,
    y: 500
  };
  parallaxScrolling(position.x, position.y, space);
  drawFood(position);
  drawOtherPlayers(position);

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

window.oncontextmenu = function (e) {
  e.preventDefault();
};


window.keyPressed = function () {
  if (gameStarted) {
    if (keyCode === UP_ARROW || keyCode === 87) {
      socket.emit('keyPressed', "isMoving");
    }
  }
};

window.keyReleased = function () {
  if (gameStarted) {
    if (keyCode === UP_ARROW || keyCode === 87) {
      socket.emit('keyReleased', "isMoving");
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
    checkIfPlayerHasChosenALevelOption();
  }
};


function processPlayerShooting() {
  socket.emit('bullet');
}

function checkMuteToggled() {
  if (muteButton) {
    muteButton.checkIfClicked(mouseX, mouseY);
  }
}

function checkIfPlayerHasChosenALevelOption() {
  if (playerLevelUpPoints > 0) {
    if (speedOption.hasPlayerClickedOption(mouseX, mouseY)) {
      playerLevelUpPoints -= 1;
      socket.emit('lvlUp', "speed");
    } else if (damageOption.hasPlayerClickedOption(mouseX, mouseY)) {
      playerLevelUpPoints -= 1;
      socket.emit('lvlUp', "damage");
    } else if (regenOption.hasPlayerClickedOption(mouseX, mouseY)) {
      playerLevelUpPoints -= 1;
      socket.emit('lvlUp', "regen");
    }
  }
}

function clientLogging() {
  if (frameCount % 300 === 0) {
    console.log("*******************************");
    console.log("Asteroids " + asteroids.length);
    console.log("XpGems " + xpGems.length);
    console.log("Popups " + popups.length);
    console.log("players " + otherPlayers.length);
    console.log("foods " + food.length);
    console.log("asteroids  " + asteroids.length);
    console.log("bullets  " + bullets.length);
    console.log("Power Up Points" + playerLevelUpPoints);
  }

}


