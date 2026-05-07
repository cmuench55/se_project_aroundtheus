export default class Popup {
  constructor({ popupSelector }) {
    this._popupElement = document.querySelector(popupSelector);
    this._handleEscClose = this._handleEscClose.bind(this);
    this._handleOverlayClose = this._handleOverlayClose.bind(this);
  }

  open() {
    this._popupElement.classList.add("modal_opened");
    document.addEventListener("keydown", this._handleEscClose);
  }

  close() {
    this._popupElement.classList.remove("modal_opened");
    document.removeEventListener("keydown", this._handleEscClose);
  }

  _handleEscClose(evt) {
    if (evt.key === "Escape") {
      this.close();
    }
  }

  _handleOverlayClose(evt) {
    if (evt.target === this._popupElement) {
      this.close();
    }
  }

  setEventListeners() {
    this._popupElement.addEventListener("mousedown", this._handleOverlayClose);
    const closeButton = this._popupElement.querySelector(".modal__close-btn");
    if (closeButton) {
      closeButton.addEventListener("click", () => this.close());
    }
  }
}
