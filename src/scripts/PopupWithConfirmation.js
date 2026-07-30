import Popup from "./Popup.js";

export default class PopupWithConfirmation extends Popup {
  constructor({ popupSelector, handleConfirm }) {
    super({ popupSelector });
    this._popupForm = this._popupElement.querySelector(".modal__form");
    this._handleConfirm = handleConfirm;
  }

  open(cardId, cardElement) {
    this._cardId = cardId || cardElement?.dataset?.cardId;
    this._cardElement = cardElement;
    super.open();
  }

  setEventListeners() {
    super.setEventListeners();
    this._popupForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this._handleConfirm(this._cardId, this._cardElement);
    });
  }

  close() {
    this._popupForm.reset();
    super.close();
  }
}
