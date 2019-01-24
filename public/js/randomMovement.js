

export default function(movingObject) {
  if (movingObject.x === movingObject.targetX || movingObject.y === movingObject.targetY) {
    movingObject.targetX = movingObject.x + random(-movingObject.speed, movingObject.speed);
    movingObject.targetY = movingObject.y + random(-movingObject.speed, movingObject.speed);
  }

  if (abs(movingObject.x - movingObject.targetX) < 1) {
    movingObject.targetX = movingObject.x + random(-movingObject.speed, movingObject.speed);
  }

  if (abs(movingObject.y -movingObject.targetY) < 1) {
    movingObject.targetY = movingObject.y + random(-movingObject.speed, movingObject.speed);
  }

  movingObject.x = lerp(movingObject.x, movingObject.targetX, 0.02);
  movingObject.y = lerp(movingObject.y, movingObject.targetY, 0.02);

  if (movingObject.x > movingObject.startX + movingObject.maxMovement) {
    movingObject.targetX -= movingObject.adjustment;
  }
  if (movingObject.x < movingObject.startX - movingObject.maxMovement) {
    movingObject.targetX += movingObject.adjustment;
  }

  if (movingObject.y > movingObject.startY + movingObject.maxMovement) {
    movingObject.targetY -= movingObject.adjustment;
  }

  if (movingObject.y < movingObject.startY - movingObject.maxMovement) {
    movingObject.targetY += movingObject.adjustment;
  }
  
}
