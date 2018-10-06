import Popup from './Popup.js';

export default class IncreaseShield extends Popup{

  constructor(number, x, y) {
    super(color(0, 255, 0, 255),
          color(255, 255, 255, 255),
          "+" + number,
          x, y);
  }

}
