export default function (player) {
  let shield = player.shield;
  push();

  fill(0, 255, 100);
  shield = map(shield, 0, 1000, 0, 150);

  rectMode(CENTER);

  rect(player.pos.x, player.pos.y + 60, shield, 10);


  let percentageHealth = player.shield;

  percentageHealth = map(percentageHealth, 0, 1000, 0, 100);

  text(floor(percentageHealth) + "%", player.pos.x, player.pos.y + 80,);
  pop();
}
