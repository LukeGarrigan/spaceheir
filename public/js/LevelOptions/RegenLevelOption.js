import LevelOptions from "./LevelOptions.js";

export default class RegenLevelOption extends LevelOptions {
  constructor(regenImage) {
    super(regenImage);
  }

  setXAndY() {
    this.y = this.viewY + windowHeight / 3.4 + height / 2;
    this.x = this.viewX + windowWidth / 2 - 160 - this.imageWidth / 2;
  }

}
