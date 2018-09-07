function Bullet(x, y, playerAngle, isOtherPlayer) {
  this.pos = createVector(x, y);
  this.velocity = p5.Vector.fromAngle(playerAngle);
  this.velocity.mult(10);
  this.r = 10;
  this.isOtherPlayer = isOtherPlayer;


  this.updateAndDisplay = function() {
    this.r = lerp(this.r, 0, 0.005);
    this.pos.add(this.velocity);
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }


  this.checkCollisionsWithPlayer = function(bullets, player, i) {
    let bulletStillExist = true;
    if (this.hasDiminished()) {
      bullets.splice(i, 1);
      bulletStillExist = false;
    }

    if (bulletStillExist && this.hasHitPlayer(player) && this.isOtherPlayer) {
      player.reduceShield();
      bullets.splice(i, 1);
    }

  }

  this.hasHit = function(asteroid) {
    return dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y) <= asteroid.r;
  }

  this.hasHitPlayer = function(player) {
    return dist(player.pos.x, player.pos.y, this.pos.x, this.pos.y) <= player.r;
  }

  this.hasDiminished = function() {
    if (this.r <= 1) {
      return true;
    }
    return false;
  }


}