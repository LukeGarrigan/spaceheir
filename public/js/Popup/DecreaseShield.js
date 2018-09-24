import Popup from './Popup.js';

export default class DecreaseShield extends Popup{

  constructor(decrease, x, y) {
    super(color(255, 0, 0, 255),
          color(255, 255, 255, 255),
          decrease,
          x, y);
  }

}
