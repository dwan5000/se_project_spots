import "./index.css";
import {
  enableValidation,
  settings,
  disableButton,
  resetValidation,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { data } from "autoprefixer";
import { setButtonText } from "../utils/helper.js";

// const initialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "32970831-fc2e-41b9-9851-50f6f1d3a26f",
    "Content-Type": "application/json",
  },
});

const profileTitle = document.querySelector(".profile__title");
const profileSubTitle = document.querySelector(".profile__subtitle");
const profileButton = document.querySelector(".profile__button");
const profileAddButton = document.querySelector(".profile__plus-button");
const avatarAddButton = document.querySelector(".profile__avatar-btn");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const addModal = document.querySelector("#add-card-modal");
const addModalCloseBtn = addModal.querySelector(".modal__close-btn");
const addFormElement = addModal.querySelector(".modal__form");
const addSubmitButton = addModal.querySelector(".modal__submit-btn");
const addModalImgInput = addModal.querySelector("#add-card-link-input");
const addModalCapInput = addModal.querySelector("#add-card-name-input");

const avatarModal = document.querySelector("#avatar-modal");
const avatarImg = document.querySelector(".profile__avatar");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const avatarSubmitButton = avatarModal.querySelector(".modal__submit-btn");
const avatarModalNameInput = avatarModal.querySelector("#profile-avatar-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteCancelButton = deleteModal.querySelector(
  ".modal__submit_cancel-btn"
);

const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const previewCloseButton = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);

let selectedCard, selectedCardId;

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    profileTitle.textContent = userInfo.name;
    profileSubTitle.textContent = userInfo.about;
    avatarImg.src = userInfo.avatar;
  })
  .catch(console.error);

editModal.addEventListener("click", (evt) => {
  if (evt.target === editModal) {
    closeModal(editModal);
  }
});

addModal.addEventListener("click", (evt) => {
  if (evt.target === addModal) {
    closeModal(addModal);
  }
});

previewModal.addEventListener("click", (evt) => {
  if (evt.target === previewModal) {
    closeModal(previewModal);
  }
});

deleteModal.addEventListener("click", (evt) => {
  if (evt.target === deleteModal) {
    closeModal(deleteModal);
  }
});

avatarModal.addEventListener("click", (evt) => {
  if (evt.target === avatarModal) {
    closeModal(avatarModal);
  }
});

function getCardElement(cardData) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikedEl = cardElement.querySelector(".card__like-button");
  const cardDeleteEl = cardElement.querySelector(".card__delete-button");

  cardNameEl.textContent = cardData.name;
  cardImageEl.src = cardData.link;
  cardImageEl.alt = cardData.name;

  if (cardData.isLiked) {
    cardLikedEl.classList.add("card__like-button_liked");
  }

  cardLikedEl.addEventListener("click", (evt) => handleLike(evt, cardData._id));

  cardDeleteEl.addEventListener("click", () =>
    handleDeleteCard(cardElement, cardData._id)
  );

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImage.src = cardData.link;
    previewModalCaption.textContent = cardData.name;
    previewModalImage.alt = cardData.name;
  });

  return cardElement;
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".modal_is-opened");
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

function openModal(modal) {
  document.addEventListener("keydown", handleEscape);
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  document.removeEventListener("keydown", handleEscape);
  modal.classList.remove("modal_is-opened");
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileTitle.textContent = data.name;
      profileSubTitle.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAddFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .addCard({
      name: addModalCapInput.value,
      link: addModalImgInput.value,
    })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      closeModal(addModal);
      evt.target.reset();
      disableButton(addSubmitButton, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleLike(evt, cardId) {
  evt.preventDefault();
  const isLiked = evt.target.classList.contains("card__like-button_liked");
  api
    .changeLikeStatus(cardId, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button_liked");
      console.log(cardId);
    })
    .catch(console.error);
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Deleting...";
  api
    .deleteCard(selectedCardId)
    .then(() => {
      closeModal(deleteModal);
      selectedCard.remove();
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Delete";
    });
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .editAvatarInfo({
      avatar: avatarModalNameInput.value,
    })
    .then((data) => {
      avatarImg.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

profileButton.addEventListener("click", () => {
  editModalNameInput.value = profileTitle.textContent;
  editModalDescriptionInput.value = profileSubTitle.textContent;
  openModal(editModal);
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

profileAddButton.addEventListener("click", () => {
  openModal(addModal);
});

avatarAddButton.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

addModalCloseBtn.addEventListener("click", () => {
  closeModal(addModal);
});

previewCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
addFormElement.addEventListener("submit", handleAddFormSubmit);
avatarFormElement.addEventListener("submit", handleAvatarFormSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

enableValidation(settings);
