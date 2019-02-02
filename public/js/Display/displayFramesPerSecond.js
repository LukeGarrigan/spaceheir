let totalFrames = 0;
let lastLoop = new Date();
let sumOfFrameRates = 1;
let frameRate = 0;


export default function displayFramesPerSecond() {
  totalFrames++;
  let thisLoop = new Date();
  let fps = 1000 / (thisLoop - lastLoop);
  lastLoop = thisLoop;
  sumOfFrameRates += fps;
  if (frameCount % 15 === 0) {
    frameRate = fps;
  }

  text("FPS: " + floor(frameRate), width - 100, height - 50);
  text("AVG FPS: " + floor(sumOfFrameRates /totalFrames), width - 100, height - 25);
}