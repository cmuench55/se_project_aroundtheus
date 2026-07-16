import "../pages/index.css";
import { validationConfig, cardSelector } from "./utils/utils.js";
import Card from "./components/Card.js";
import FormValidator from "./components/FormValidator.js";
import Section from "./Section.js";
import PopupWithForm from "./PopupWithForm.js";
import PopupWithImages from "./PopupWithImages.js";
import UserInfo from "./UserInfo.js";
import { createCard, getFallbackCards, getInitialData, updateUserProfile } from "./api.js";

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

function renderCard(cardItem) {
  const card = new Card(cardItem, cardSelector, (name, link) => {
    imagePreviewPopup.open(name, link);
  });

  cardSection.addItem(card.getView());
}

function loadInitialContent() {
  getInitialData()
    .then(({ user, cards }) => {
      if (user) {
        userInfo.setUserInfo({
          name: user.name,
          about: user.about,
        });
      }

      cards.forEach((cardItem) => {
        renderCard({
          name: cardItem.name,
          link: cardItem.link,
        });
      });
    })
    .catch((error) => {
      console.error("Unable to load remote data, using local fallback.", error);
      getFallbackCards().forEach((cardItem) => {
        renderCard(cardItem);
      });
    });
}

function handleProfileEditSubmit(formValues) {
  const submitButton = profileEditForm.querySelector(".modal__button");
  submitButton.textContent = "Saving...";
  submitButton.disabled = true;

  updateUserProfile({
    name: formValues.title,
    about: formValues.description,
  })
    .then((profile) => {
      userInfo.setUserInfo({
        name: profile.name,
        about: profile.about,
      });
      editProfilePopup.close();
    })
    .catch((error) => {
      console.error("Profile update failed.", error);
    })
    .finally(() => {
      submitButton.textContent = "Save";
      submitButton.disabled = false;
    });
}

function handleAddCardFormSubmit(formValues) {
  const submitButton = addCardForm.querySelector(".modal__button");
  submitButton.textContent = "Creating...";
  submitButton.disabled = true;

  createCard({ name: formValues.title, link: formValues.link })
    .then((newCard) => {
      renderCard({
        name: newCard.name,
        link: newCard.link,
      });
      addCardPopup.close();
      addFormValidator.disableSubmitButton();
    })
    .catch((error) => {
      console.error("Card creation failed.", error);
    })
    .finally(() => {
      submitButton.textContent = "Create";
      submitButton.disabled = false;
    });
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

loadInitialContent();
