import "../pages/index.css";
import { validationConfig, cardSelector } from "./utils/utils.js";
import Card from "./components/Card.js";
import FormValidator from "./components/FormValidator.js";
import Section from "./Section.js";
import PopupWithForm from "./PopupWithForm.js";
import PopupWithImages from "./PopupWithImages.js";
import PopupWithConfirmation from "./PopupWithConfirmation.js";
import UserInfo from "./UserInfo.js";
import Api from "./api.js";

const profileEditButton = document.querySelector("#profile-edit-button");
const avatarEditButton = document.querySelector("#avatar-edit-button");
const addCardButton = document.querySelector("#add-card-button");
const profileEditForm = document.forms["edit-profile-form"];
const avatarEditForm = document.forms["edit-avatar-form"];
const addCardForm = document.forms["add-card-form"];

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  aboutSelector: ".profile__description",
  avatarSelector: ".profile__image",
});

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "1b3cac0a-3105-41b5-b45b-c70fe76e4355",
    "Content-Type": "application/json",
  },
});

const editFormValidator = new FormValidator(validationConfig, profileEditForm);
const avatarFormValidator = new FormValidator(validationConfig, avatarEditForm);
const addFormValidator = new FormValidator(validationConfig, addCardForm);

const imagePreviewPopup = new PopupWithImages({
  popupSelector: "#preview-modal",
});

const editProfilePopup = new PopupWithForm({
  popupSelector: "#profile-edit-modal",
  handleFormSubmit: handleProfileEditSubmit,
});

const avatarEditPopup = new PopupWithForm({
  popupSelector: "#avatar-edit-modal",
  handleFormSubmit: handleAvatarEditSubmit,
});

const addCardPopup = new PopupWithForm({
  popupSelector: "#add-card-modal",
  handleFormSubmit: handleAddCardFormSubmit,
});

const deleteConfirmPopup = new PopupWithConfirmation({
  popupSelector: "#confirm-modal",
  handleConfirm: (cardId, cardElement) => {
    if (!cardId) {
      cardElement.remove();
      deleteConfirmPopup.close();
      return;
    }

    api
      .deleteCard(cardId)
      .then(() => {
        cardElement.remove();
        deleteConfirmPopup.close();
      })
      .catch((error) => {
        console.error("Card deletion failed.", error);
        cardElement.remove();
        deleteConfirmPopup.close();
      });
  },
});

editProfilePopup.setEventListeners();
avatarEditPopup.setEventListeners();
addCardPopup.setEventListeners();
deleteConfirmPopup.setEventListeners();
imagePreviewPopup.setEventListeners();

editFormValidator.enableValidation();
avatarFormValidator.enableValidation();
addFormValidator.enableValidation();

const cardSection = new Section(
  {
    renderer: (cardItem) => {
      const card = new Card(
        cardItem,
        cardSelector,
        (name, link) => {
          imagePreviewPopup.open(name, link);
        },
        (cardId, cardElement) => {
          deleteConfirmPopup.open(cardId, cardElement);
        },
        (cardId, isLiked) => api.changeLikeCardStatus(cardId, !isLiked)
      );
      cardSection.addItem(card.getView());
    },
  },
  ".cards__list"
);

function renderCard(cardItem) {
  const card = new Card(
    cardItem,
    cardSelector,
    (name, link) => {
      imagePreviewPopup.open(name, link);
    },
    (cardId, cardElement) => {
      deleteConfirmPopup.open(cardId, cardElement);
    },
    (cardId, isLiked) => api.changeLikeCardStatus(cardId, !isLiked)
  );

  cardSection.addItem(card.getView());
}

function loadInitialContent() {
  api
    .getAppInfo()
    .then(([user, cards]) => {
      if (user) {
        userInfo.setUserInfo({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
      }

      const cardList = Array.isArray(cards) ? cards : [cards];

      cardList.forEach((cardItem) => {
        renderCard({
          _id: cardItem._id,
          name: cardItem.name,
          link: cardItem.link,
        });
      });
    })
    .catch((error) => {
      console.error("Unable to load cards from the server.", error);
    });
}

function handleProfileEditSubmit(formValues) {
  const submitButton = profileEditForm.querySelector(".modal__button");
  submitButton.textContent = "Saving...";
  submitButton.disabled = true;

  api
    .editProfile({
      name: formValues.title,
      about: formValues.description,
    })
    .then((profile) => {
      userInfo.setUserInfo({
        name: profile.name,
        about: profile.about,
        avatar: profile.avatar,
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

function handleAvatarEditSubmit(formValues) {
  const submitButton = avatarEditForm.querySelector(".modal__button");
  submitButton.textContent = "Saving...";
  submitButton.disabled = true;

  api
    .updateAvatar({ avatar: formValues.avatar })
    .then((profile) => {
      userInfo.setUserInfo({ avatar: profile.avatar });
      avatarEditPopup.close();
    })
    .catch((error) => {
      console.error("Avatar update failed.", error);
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

  api
    .addCard({ name: formValues.title, link: formValues.link })
    .then((newCard) => {
      renderCard({
        _id: newCard._id,
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

avatarEditButton.addEventListener("click", () => {
  const currentUserInfo = userInfo.getUserInfo();
  avatarEditPopup.setInputValues({
    avatar: currentUserInfo.avatar,
  });
  avatarFormValidator.resetValidation();
  avatarEditPopup.open();
});

addCardButton.addEventListener("click", () => {
  addFormValidator.resetValidation();
  addCardPopup.open();
});

loadInitialContent();
