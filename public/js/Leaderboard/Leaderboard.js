export default class Leaderboard {

  constructor(player, leaders) {
    this.player = player;
    this._leaders = leaders;
  }

  updateLeaderboard(player, leaders) {
    this.player = player;
    this._leaders = leaders;
  }

  displayLeaderboard() {
    for (let i = 0; i < this._leaders.length && i < 10; i++) {
      push();
      textAlign(LEFT);
      if (i === 0) {
        fill(255, 69, 0);
        stroke(255, 69, 0);
        textSize(15);
        text(this._leaders[i].name + " : " + this._leaders[i].score, this.player.pos.x - width / 2 + 25, this.player.pos.y - height / 2 + 50 + i * 20);
      } else {
        text(this._leaders[i].name + " : " + this._leaders[i].score, this.player.pos.x - width / 2 + 25, this.player.pos.y - height / 2 + 50 + i * 20);
      }
      pop();
    }
  }


  get leaders() {
    return this._leaders;
  }
}