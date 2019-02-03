let totalFrames = 0;
let lastLoop = new Date();
let sumOfFrameRates = 1;
let frameRate = 0;


export default function displayFramesPerSecond(x, y) {
  totalFrames++;
  let thisLoop = new Date();
  let fps = 1000 / (thisLoop - lastLoop);
  lastLoop = thisLoop;
  sumOfFrameRates += fps;
  if (frameCount % 15 === 0) {
    frameRate = fps;
  }

  text("FPS: " + floor(frameRate), x+ width/2 - 100, y + height /2- 50);
  text("AVG FPS: " + floor(sumOfFrameRates /totalFrames), x + width/2  - 100, y + height/2 - 25);
}