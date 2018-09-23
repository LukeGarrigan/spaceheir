export default class HitMarker {

  constructor(player, image) {
    console.log(player);
    if (player){
      this.x = player.x;
      this.y = player.y;
      this.r = player.r;
      this.isVisible = true;
      this.isInitialised = true;
      this.time = 8;
    } else {
      this.isInitialised = false;
      this.isVisible = false;
    }
    this.hitMarkerImage = image;
  }


  display() {
    this.time--;
    if (this.isInitialised && this.time > 0) {
      push();
      image(this.hitMarkerImage, this.x-this.r, this.y-this.r, 35, 35);
      pop();
    }

  }



}
