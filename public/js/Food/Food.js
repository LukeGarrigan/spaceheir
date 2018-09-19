
function Food(x, y, r, id) {

  this.x = x;
  this.y = y;
  this.r = r;
  this.id = id;

  this.display = function() {
    noFill();
    stroke(255);
    ellipse(this.x, this.y, this.r, this.r);
  }

}
