function Asteroid(pos, minSize, maxSize) {
  this.pos = createVector(pos.x, pos.y);
  this.velocity = p5.Vector.random2D();
  this.minSize = minSize;
  this.maxSize = maxSize;
  this.r = random(this.minSize ,this.maxSize);
  this.total = 6;
  this.offset = [];

  for (var i = 0; i < this.total; i++) {
    this.offset[i] = random(-15, 10);
  }


  this.update = function() {
    this.pos.add(this.velocity);
  }

  this.display = function() {
    push();
    translate(this.pos.x, this.pos.y);
    noFill();
    stroke(255);

    beginShape();
    for (var i = 0; i < this.total; i++) {
      var angle = map(i, 0, this.total, 0, TWO_PI);
      var x = (this.r+this.offset[i])*cos(angle);
      var y = (this.r+this.offset[i])*sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();

  }

  this.constrain = function() {
    if (this.pos.x < 0) {
      this.pos.x = width*3;
    } else if (this.pos.x > width*3) {
      this.pos.x = 0;
    }

    if (this.pos.y < 0) {
      this.pos.y = height*3;
    } else if (this.pos.y > height*3) {
      this.pos.y =0;
    }
  }


  this.shouldCreateNewAsteroids = function() {
     if (this.minSize >= 15) {
       return true;
     }
     return false;
  }

  this.getNewAsteroids = function() {
    var asteroids = [];

    if (this.minSize >= 5) {
      var firstAsteroid = new Asteroid(this.pos, this.minSize/2, this.maxSize/2);
      var secondAsteroid = new Asteroid(this.pos,this.minSize/2, this.maxSize/2);
      asteroids.push(firstAsteroid, secondAsteroid);
    }

    return asteroids;
  }

  this.hasCollided = function(asteroid) {
    return dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y) <= this.r + asteroid.r;
  }

  this.hasHitPlayer = function(player) {
     return dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y) <= this.r + player.r;
  }

  this.checkCollisionsWithPlayers = function(asteroids, player, i) {
    // console.log("Asteroids :" + i);
    if (this.hasHitPlayer(player)) {
      player.reduceShield();
      if (this.shouldCreateNewAsteroids()) {
        var newAsteroids = this.getNewAsteroids();
        asteroids.push(...newAsteroids);
      }
      console.log("splicing");
      asteroids.splice(this, 1);
    }
  }


}
