import Popup from './Popup.js';

export default class DecreaseShield extends Popup{

  constructor(decrease, x, y) {
    super(color(237, 40, 14, 255),
          color(237, 40, 14, 255),
          decrease,
          x, y);
  }

}
