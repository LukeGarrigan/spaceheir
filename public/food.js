
function Food() {

  this.x = random(width*3);
  this.y = random(height*3);
  this.random = random(0, 50);
  this.r = random(20);

  this.setup = function() {
    if (this.random > 47) {
      this.r = random(10, 20);
    } else {
      this.r = random(10);
    }
  }

  this.display = function() {
    noFill();
    stroke(255);
    ellipse(this.x, this.y, this.r, this.r);
  }

  this.hasBeenEaten = function(player) {
    if (dist(this.x, this.y, player.pos.x, player.pos.y) <= this.r + player.r) {
      return true;
    }
    return false;
  }

  this.resetPosition = function() {
    this.x = random(width);
    this.y = random(height);
  }
  this.checkCollisionsWithPlayer = function(player,i) {
    if (food[i].hasBeenEaten(player)) {
      food[i].resetPosition();
      return true;
    }
  }

}
