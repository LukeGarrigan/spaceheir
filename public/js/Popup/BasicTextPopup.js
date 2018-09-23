import Popup from './Popup.js';

export default class BasicTextPopup extends Popup {
  constructor(text, textSize) {
    super();
    this.textContent = text;
    this.textSize = textSize;
  }
}