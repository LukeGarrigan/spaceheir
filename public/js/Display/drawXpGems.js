import {isWithinScreenXAndY} from '../game-logic.js';

export default function(player,gems) {
  for (let gem of gems) {
    if (isWithinScreenXAndY(player, gem.x, gem.y)) {
      gem.display();
    }
  }
}