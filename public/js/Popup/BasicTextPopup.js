import Popup from './Popup.js';

export default class BasicTextPopup extends Popup {
  constructor(text, textSize) {
    super(color(255, 0, 0, 255),
      color(255, 255, 255, 255),
      text);
    this.textSize = textSize;
  }
}
