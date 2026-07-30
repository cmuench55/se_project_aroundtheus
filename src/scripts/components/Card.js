class Card {
  constructor(cardData, cardSelector, handleImageClick, handleDeleteClick, handleLikeClick) {
    this._id = cardData._id || cardData.id;
    this._name = cardData.name;
    this._link = cardData.link;
    this._isLiked = Boolean(cardData.isLiked);
    this._handleImageClick = handleImageClick;
    this._handleDeleteClick = handleDeleteClick;
    this._handleLikeClick = handleLikeClick;
    this._cardSelector = cardSelector;
  }

  _getTemplate() {
    return document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
  }

  _updateLikeButton() {
    const likeButton = this._element.querySelector(".card__like-button");
    likeButton.classList.toggle("card__like-button_active", this._isLiked);
  }

  _setEventListeners() {
    const likeButton = this._element.querySelector(".card__like-button");
    likeButton.addEventListener("click", () => {
      if (!this._handleLikeClick) {
        this._isLiked = !this._isLiked;
        this._updateLikeButton();
        return;
      }

      this._handleLikeClick(this._id, this._isLiked)
        .then((updatedCard) => {
          this._isLiked = Boolean(updatedCard.isLiked);
          this._updateLikeButton();
        })
        .catch((error) => {
          console.error("Unable to update like status.", error);
        });
    });

    this._element
      .querySelector(".card__delete-button")
      .addEventListener("click", () => {
        this._handleDeleteClick(this._id, this._element);
      });

    this._element
      .querySelector(".card__image")
      .addEventListener("click", () => {
        this._handleImageClick(this._name, this._link);
      });
  }

  getView() {
    this._element = this._getTemplate();
    const imageEl = this._element.querySelector(".card__image");
    const titleEl = this._element.querySelector(".card__title");

    this._element.dataset.cardId = this._id || "";
    imageEl.src = this._link;
    imageEl.alt = this._name;
    titleEl.textContent = this._name;

    this._setEventListeners();
    this._updateLikeButton();
    return this._element;
  }
}

export default Card;
