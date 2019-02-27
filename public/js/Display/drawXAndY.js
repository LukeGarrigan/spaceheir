export default function(x, y) {
    textAlign(LEFT);
    text("X: " + floor(x), x + width/2  - 450, y + height/2 - 100);
    text("Y: " + floor(y), x + width/ 2- 450, y + height/2 - 75);
}