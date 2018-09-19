function Bullet(x, y, playerAngle, shooterId, id, bulletSize) {
  this.pos = createVector(x, y);
  this.velocity = p5.Vector.fromAngle(playerAngle);
  this.velocity.mult(10);
  this.r = 10;
  this.shooterId = shooterId;
  this.id = id;
  this.bulletSize = bulletSize;


  this.updateAndDisplay = function() {
    this.r = lerp(this.r, 0, 0.01);
    this.pos.add(this.velocity);
    this.bulletSize--;
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }

  this.hasBulletDiminished = function() {
    if (this.hasDiminished()) {
      return true;
    }
  }

  this.checkCollisionsWithPlayer = function(bullets, player, i) {
    // console.log(socket.id);
    // console.log(bullets);
    // console.log("Bullet clientId: " +bullets.clientId);
    // console.log(socketId);

    if (this.hasHitPlayer(player) && shooterId !== socket.id) {
      player.reduceShield();
      return true;
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
