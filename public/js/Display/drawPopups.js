
export default function(popups) {
  for (let i = popups.length - 1; i >= 0; i--) {
    popups[i].update();
    popups[i].display();
    if (!popups[i].isVisible) {
      popups.splice(i, 1);
    }
  }
}
