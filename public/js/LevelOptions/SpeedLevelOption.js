import LevelOptions from "./LevelOptions.js";

export default class SpeedLevelOption extends LevelOptions{
  constructor(speedImage, transparentImage) {
    super(speedImage, transparentImage);
  }

  setXAndY() {
    this.y = this.viewY + windowHeight / 3.4 + height / 2;
    this.x = this.viewX + windowWidth / 2 - this.width / 2;
  }

}
