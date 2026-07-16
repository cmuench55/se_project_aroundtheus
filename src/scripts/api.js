import { initialCards } from "./utils/utils.js";

const BASE_URL = "https://around.nomoreparties.co/v1/web_es_cohort_05";
const AUTH_TOKEN = "f455c59d-84dc-4ca4-92e9-7f63889c99e2";

function request(endpoint, options = {}) {
  return fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      authorization: AUTH_TOKEN,
      "Content-Type": "application/json",
    },
    ...options,
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((errorPayload) => {
        throw new Error(errorPayload.message || "Request failed");
      });
    }

    return res.json();
  });
}

export function getInitialData() {
  return Promise.all([request("/users/me"), request("/cards")]).then(
    ([user, cards]) => ({ user, cards })
  );
}

export function updateUserProfile({ name, about }) {
  return request("/users/me", {
    method: "PATCH",
    body: JSON.stringify({ name, about }),
  });
}

export function createCard({ name, link }) {
  return request("/cards", {
    method: "POST",
    body: JSON.stringify({ name, link }),
  });
}

export function getFallbackCards() {
  return initialCards;
}
