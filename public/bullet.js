function Bullet(x, y, playerAngle) {

  this.pos = createVector(x, y);
  this.velocity = p5.Vector.fromAngle(playerAngle);
  this.velocity.mult(10);
  this.r = 10;
  this.update = function() {
    this.r = lerp(this.r, 0, 0.005);
    this.pos.add(this.velocity);
  }

  this.display = function() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }


  this.hasHit = function(asteroid) {
    return dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y) <= asteroid.r;
  }

  this.shouldBeDestroyed = function() {
    if (this.r <= 1) {
      return true;
    }
    return false;
  }


}
