export default class XpBar {

  constructor() {

  }

  display(player) {

    let xp = player.xp;



    let startXp = this.xpNeededForLvl(player.lvl);
    let nextLvlXp = this.xpNeededForLvl(player.lvl + 1);

    let width = Math.floor(window.outerWidth/2);

    push();
    translate(player.pos.x, player.pos.y);
    noStroke();
    fill(255, 255, 255, 10);
    rect(width - 100, 60, 35, -400);


    fill(75, 0, 130, 100);
    xp = map(xp, startXp, nextLvlXp, 0, -400);

    rect(width - 100, 60, 35, xp);

    fill(255, 255, 255);

    textAlign(CENTER);
    text(`Lvl ${player.lvl}`, width -83.5, 75);
    text(`Lvl ${player.lvl + 1}`, width -83.5, -350);

    pop();
  }


  xpNeededForLvl(level) {
    return floor(sq(level / 0.04));
  }


}