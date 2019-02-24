export default function(messages, x, y) {
  let startY = y + height/2 - 110;
  for (let i = messages.length -1; i >= 0; i--) {
    push();
    textSize(15);
    fill(255);
    textAlign(LEFT);
    text(`${messages[i].sender}:  ${messages[i].message}`, x + width/ 2 - 320, startY);
    startY -= 25;
    pop();
  }


}