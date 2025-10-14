class Card {
  constructor(cardData, cardSelector) {
    this._name = cardData.name;
    this._link = cardData.link;

    this._cardSelector = cardSelector;
  }

  _setEventListeners() {
    this._element
      .querySelector(".card__like-button")
      .addEventListener("click", () => {
        this._element
          .querySelector(".card__like-button")
          .classList.toggle("card__like-button_active");
      });

    this._element
      .querySelector(".card__delete-button")
      .addEventListener("click", () => {
        this._element.remove();
      });

    this._element
      .querySelector(".card__image")
      .addEventListener("click", () => {
        alert(`Preview: ${this._name}`);
      });
  }

  _getTemplate() {
    const template = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    return template;
  }

  getView() {
    this._element = this._getTemplate();
    this._setEventListeners();
    const imageEl = this._element.querySelector(".card__image");
    const titleEl = this._element.querySelector(".card__title");
    imageEl.src = this._link;
    imageEl.alt = this._name;
    titleEl.textContent = this._name;
    return this._element;
  }
}

export default Card;
