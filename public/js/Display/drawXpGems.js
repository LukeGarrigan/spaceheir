import {isWithinScreenXAndY} from '../gameLogic.js';
import {PLAYAREA_HEIGHT, PLAYAREA_WIDTH} from "../Constants.js";
import Gem from "../classes/Gem.js";
import randomMovement from "../randomMovement.js";

export default function(player,gems) {
  let xpGemClones = createXpGemClones(player, gems);
  
  for (let gem of xpGemClones) {
    if (isWithinScreenXAndY(player, gem.x, gem.y)) {
      display(gem);
    }
  }
}




function createXpGemClones(player, gems) {
  let gemsClones = [];
  if (gems) {
    gems.forEach(gem => {
      gemsClones.push(gem);

      let gemImage = gem.gemImage;

      let topLeft = JSON.parse(JSON.stringify(gem));
      topLeft.x = gem.x - PLAYAREA_WIDTH;
      topLeft.y = gem.y - PLAYAREA_HEIGHT;
      topLeft.gemImage = gemImage;


      let top = JSON.parse(JSON.stringify(gem));
      top.x = gem.x;
      top.y = gem.y - PLAYAREA_HEIGHT;
      top.gemImage = gemImage;

      let topRight = JSON.parse(JSON.stringify(gem));
      topRight.x = gem.x + PLAYAREA_WIDTH;
      topRight.y = gem.y  -PLAYAREA_HEIGHT;
      topRight.gemImage = gemImage;

      let right = JSON.parse(JSON.stringify(gem));
      right.x = gem.x + PLAYAREA_WIDTH;
      right.y = gem.y;
      right.gemImage = gemImage;

      let bottomRight = JSON.parse(JSON.stringify(gem));
      bottomRight.x = gem.x + PLAYAREA_WIDTH;
      bottomRight.y = gem.y +PLAYAREA_HEIGHT;
      bottomRight.gemImage = gemImage;

      let bottom = JSON.parse(JSON.stringify(gem));
      bottom.x = gem.x;
      bottom.y = gem.y + PLAYAREA_HEIGHT;
      bottom.gemImage = gemImage;


      let bottomLeft = JSON.parse(JSON.stringify(gem));
      bottomLeft.x = gem.x + -PLAYAREA_WIDTH;
      bottomLeft.y = gem.y +PLAYAREA_HEIGHT;
      bottomLeft.gemImage = gemImage;


      let left = JSON.parse(JSON.stringify(gem));
      left.x = gem.x + -PLAYAREA_WIDTH;
      left.y = gem.y;
      left.gemImage = gemImage;

      gemsClones.push(topLeft, top, topRight, right, bottomRight, bottom, bottomLeft, left);
    });
  }

  return gemsClones;

}


function display(gem) {
  // randomMovement(gem);
  // if (gem.size < gem.maxSize) {
  //   gem.size += gem.sizeIncreaser;
  // }

  push();
  translate(gem.x, gem.y);
  rotate(gem.rotation);
  image(gem.gemImage, 0, 0, gem.size, gem.size);
  pop();
}
