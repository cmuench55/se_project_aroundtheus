const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
  },
  {
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
  },
  {
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
  },
  {
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
  },
];

//Elements

  // Wrappers

  const cardListEl = document.querySelector(".cards__list");
  const profileEditModal = document.querySelector("#profile-edit-modal");
  const addCardModal = document.querySelector("#add-card-modal");
  const addCardFormElement = document.forms["add-card-form"];
  const profileEditForm = document.forms["edit-profile-form"];
  const previewModal = document.querySelector("#preview-modal");

  //Buttons and other DOM nodes

  const profileEditBtn = document.querySelector("#profile-edit-button");
  const profileCloseModalBtn = document.querySelector(".modal__close-btn");
  const addCardCloseBtn = addCardModal.querySelector("#add-card-close-modal");
  const previewModalCloseBtn = document.querySelector("#image-close-modal");
  const addCardSubmitBtn = addCardModal.querySelector("#modal-submit-btn");
  const addCardBtn = document.querySelector("#add-card-button");

  //Form Data

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;
const cardTitleInput = addCardFormElement.querySelector(
  ".modal__input_type_title");
const cardUrlInput = addCardFormElement.querySelector(".modal__input_type_url");

//Functions

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function renderCard(cardData, wrapper){
  const cardElement = getCardElement(cardData);
  wrapper.prepend(cardElement);
}

function getCardElement(cardData) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");
  const previewModalImageEl = previewModal.querySelector(".modal__image");
  const previewModalCaptionEl = previewModal.querySelector(".modal__caption");

  likeButton.addEventListener("click", () => {
  likeButton.classList.toggle("card__like-button_active");
  });

  cardTitleEl.textContent = cardData.name;
  cardImageEl.src = cardData.link;
  cardImageEl.alt = cardData.name;

  cardImageEl.addEventListener("click", ()=> {
    openModal(previewModal);
    previewModalImageEl.src = cardData.link;
    previewModalImageEl.alt = cardData.name;
    previewModalCaptionEl.textContent = cardData.name;
  })

  cardDeleteBtn.addEventListener("click", (evt) => {
    evt.target.closest(".card").remove();
  })

  return cardElement;
}

function handleProfileEditSubmit(e) {
  e.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closeModal(profileEditModal);
}

function handleAddCardFormSubmit(e) {
  e.preventDefault();
  const name = cardTitleInput.value;
  const link = cardUrlInput.value;
  renderCard({name, link}, cardListEl);
  addCardFormElement.reset(name, link);
  closeModal(addCardModal);
}

function openModal(modal) {
  modal.classList.add("modal_opened");
}

// Form Listeners

profileEditBtn.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModal(profileEditModal);
});

profileCloseModalBtn.addEventListener("click", () => closeModal(profileEditModal));

profileEditForm.addEventListener("submit", handleProfileEditSubmit);

addCardBtn.addEventListener("click", () => openModal(addCardModal));

addCardCloseBtn.addEventListener("click", () => closeModal(addCardModal));

addCardFormElement.addEventListener("submit", handleAddCardFormSubmit);

initialCards.forEach((cardData) => renderCard(cardData, cardListEl));

previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));
  

