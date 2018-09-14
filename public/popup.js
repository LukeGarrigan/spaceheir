function Popup(x, y, increase) {

  this.x = x;
  this.y = y
  this.increase = increase;
  this.timer = 0;
  this.isVisible = true;


  this.display = function() {
    console.log(this.increase)
    this.timer+=5;

    if (this.isVisible) {
      push();
      fill(0, 255, 0, 255-this.timer);
      text("+" +this.increase, this.x ,this.y);
      pop();
    }

    if (this.timer >= 255) {
      this.isVisible = false;
    }
  }




}
