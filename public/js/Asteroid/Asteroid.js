export default class Food {
  constructor(x, y, id, asteroidImage, r) {
    this.asteroidImage = asteroidImage;
    this.x = x;
    this.y = y;
    this.id = id;
    this.r = r;
    this.particles = [];
    this.hasExploded = false;
    this.lifeSpan = 75;
  }

  initialiseExplosion() {
    for (let i = 0; i < this.r; i++) {

      let particle = {
        pos: createVector(this.x, this.y),
        velocity: p5.Vector.random2D().mult(random(1,4)),
        width: this.r/25,
        height: this.r/25
      };

      this.particles.push(particle);
    }

    this.lifeSpan = this.r / 5;
    this.hasExploded = true;
  }

  drawExplosion() {
    if (this.lifeSpan <= 0) {
      this.particles = [];
      this.hasExploded = false;
      return;
    }
    for (let i = 0; i < this.particles.length; i++) {
      let currentParticle = this.particles[i];
      currentParticle.pos.add(currentParticle.velocity);
      push();
      fill(220, 220, 220);
      if (currentParticle.width >= 0 && currentParticle.height >= 0) {
        ellipse(this.particles[i].pos.x, this.particles[i].pos.y, this.particles[i].width, this.particles[i].height, 50);
      }
      currentParticle.width -= 0.1;
      currentParticle.height -= 0.1;
      pop();
    }
  }








}
