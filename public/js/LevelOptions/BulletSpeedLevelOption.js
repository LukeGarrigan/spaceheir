import LevelOptions from "./LevelOptions.js";

export default class BulletSpeedLevelOption extends LevelOptions {
  constructor(bulletSpeedImage, bulletSpeedTransparentImage) {
    super(bulletSpeedImage, bulletSpeedTransparentImage);

  }

  setXAndY() {
    this.y = this.viewY + windowHeight / 3.4 + height / 2;
    this.x = this.viewX + windowWidth / 2 + 170 + this.width  / 2;
  }

}
