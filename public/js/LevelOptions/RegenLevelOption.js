import LevelOptions from "./LevelOptions.js";

export default class RegenLevelOption extends LevelOptions {
  constructor(regenImage, transparentImage) {
    super(regenImage, transparentImage);
  }

  setXAndY() {
    this.y = this.viewY + windowHeight / 3.4 + height / 2;
    this.x = this.viewX + windowWidth / 2 - 160 - this.width / 2;
  }

}
