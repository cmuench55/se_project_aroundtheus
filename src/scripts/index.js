import "../pages/index.css";
import { initialCards, validationConfig, cardSelector } from "./utils/constants.js";
import Card from "./components/Card.js";
import FormValidator from "./components/FormValidator.js";
import Section from "./Section.js";
import PopupWithForm from "./PopupWithForm.js";
import PopupWithImages from "./PopupWithImages.js";
import UserInfo from "./UserInfo.js";

const profileEditButton = document.querySelector("#profile-edit-button");
const addCardButton = document.querySelector("#add-card-button");
const profileEditForm = document.forms["edit-profile-form"];
const addCardForm = document.forms["add-card-form"];

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  aboutSelector: ".profile__description",
});

const editFormValidator = new FormValidator(validationConfig, profileEditForm);
const addFormValidator = new FormValidator(validationConfig, addCardForm);

const imagePreviewPopup = new PopupWithImages({
  popupSelector: "#preview-modal",
});

const editProfilePopup = new PopupWithForm({
  popupSelector: "#profile-edit-modal",
  handleFormSubmit: handleProfileEditSubmit,
});

const addCardPopup = new PopupWithForm({
  popupSelector: "#add-card-modal",
  handleFormSubmit: handleAddCardFormSubmit,
});

editProfilePopup.setEventListeners();
addCardPopup.setEventListeners();
imagePreviewPopup.setEventListeners();

editFormValidator.enableValidation();
addFormValidator.enableValidation();

const cardSection = new Section(
  {
    renderer: (cardItem) => {
      const card = new Card(cardItem, cardSelector, (name, link) => {
        imagePreviewPopup.open(name, link);
      });
      cardSection.addItem(card.getView());
    },
  },
  ".cards__list"
);

cardSection.renderItems(initialCards);

function handleProfileEditSubmit(formValues) {
  userInfo.setUserInfo({
    name: formValues.title,
    about: formValues.description,
  });
  editProfilePopup.close();
}

function handleAddCardFormSubmit(formValues) {
  const newCard = new Card(
    { name: formValues.title, link: formValues.link }, 
    cardSelector,
    (name, link) => {
      imagePreviewPopup.open(name, link);
    }
  );

  cardSection.addItem(newCard.getView());
  addCardPopup.close();
  addFormValidator.disableSubmitButton();
}

profileEditButton.addEventListener("click", () => {
  const currentUserInfo = userInfo.getUserInfo();
  editProfilePopup.setInputValues({
    title: currentUserInfo.name,
    description: currentUserInfo.about,
  });
  editFormValidator.resetValidation();
  editProfilePopup.open();
});

addCardButton.addEventListener("click", () => {
  addFormValidator.resetValidation();
  addCardPopup.open();
});
