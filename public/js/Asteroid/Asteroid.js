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
    for (let i = 0; i < 300; i++) {

      let particle = {
        pos: createVector(this.x, this.y),
        velocity: p5.Vector.random2D().mult(random(4,12)),
        width: 8,
        height: 8
      };

      this.particles.push(particle);
    }

    this.lifeSpan = 75;
    this.hasExploded = true;
  }

  drawExplosion() {
    this.lifeSpan--;
    if (this.lifeSpan <= 0) {
      this.particles = [];
      this.hasExploded = false;
      return;
    }
    for (let i = 0; i < this.particles.length; i++) {
      let currentParticle = this.particles[i];
      currentParticle.pos.add(currentParticle.velocity);
      push();
      fill(250, 250, 250);
      ellipse(this.particles[i].pos.x, this.particles[i].pos.y, this.particles[i].width, this.particles[i].height);

      this.particles[i].width -= 0.1;
      this.particles[i].height -= 0.1;
      pop();
    }
  }








}
