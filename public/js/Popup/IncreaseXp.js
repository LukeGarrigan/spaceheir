import Popup from './Popup.js';

export default class IncreaseXp extends Popup {

  constructor(number, x, y) {
    super(color(75, 0, 130),
      color(75, 0, 1303),
      "+" + number + " xp",
      x, y);
  }

}
