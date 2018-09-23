import Popup from './Popup.js';

export default class BasicTextPopup extends Popup {
  constructor(text, textSize, x, y) {
    super(color(255, 0, 0, 255),
      color(255, 255, 255, 255),
      text,
      x, y);
    this.textSize = textSize;
  }
}
