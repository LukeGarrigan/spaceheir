import {isWithinScreen} from '../game-logic.js';

export default function(player,gems) {
  for (let gem of gems) {
    if (isWithinScreen(player, gems)) {
      gem.display();
    }
  }
}