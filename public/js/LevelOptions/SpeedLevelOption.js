import LevelOptions from "./LevelOptions.js";

export default class SpeedLevelOption extends LevelOptions{
  constructor(speedImage) {
    super(speedImage);
  }

  setXAndY() {
    this.y = this.viewY + windowHeight / 3.4 + height / 2;
    this.x = this.viewX + windowWidth / 2 - this.imageWidth / 2;
  }

}
