import avatarImage from "../../images/jacques-cousteau.jpg";
import baldMountainsImage from "../../images/bald-mountains.svg";
import lagoDiBraiesImage from "../../images/lago-di-braies.svg";
import lakeLouiseImage from "../../images/lake-louise.svg";
import latemarImage from "../../images/latemar.svg";
import vanoiseNationalParkImage from "../../images/vanoise-national-park.svg";
import yosemiteValleyImage from "../../images/yosemite-valley.svg";

const fallbackUser = {
	name: "Jacques Cousteau",
	about: "Explorer",
	avatar: avatarImage,
};

const fallbackCards = [
	{ name: "Yosemite Valley", link: yosemiteValleyImage },
	{ name: "Lake Louise", link: lakeLouiseImage },
	{ name: "Bald Mountains", link: baldMountainsImage },
	{ name: "Latemar", link: latemarImage },
	{ name: "Vanoise National Park", link: vanoiseNationalParkImage },
	{ name: "Lago di Braies", link: lagoDiBraiesImage },
];

export function getFallbackAppData() {
	return {
		user: fallbackUser,
		cards: fallbackCards,
	};
}

export default class Api {
	constructor({ baseUrl, headers }) {
		this._baseUrl = baseUrl;
		this._headers = headers;
	}

	_request(endpoint, options = {}) {
		return fetch(`${this._baseUrl}${endpoint}`, {
			headers: this._headers,
			...options,
		}).then((res) => {
			if (res.ok) {
				return res.json();
			}

			return Promise.reject(`Error: ${res.status}`);
		});
	}

	getAppInfo() {
		return Promise.all([this.getUserInfo(), this.getInitialCards()]);
	}

	getUserInfo() {
		return this._request("/users/me");
	}

	getInitialCards() {
		return this._request("/cards");
	}

	editProfile({ name, about }) {
		return this._request("/users/me", {
			method: "PATCH",
			body: JSON.stringify({ name, about }),
		});
	}

	updateAvatar({ avatar }) {
		return this._request("/users/me/avatar", {
			method: "PATCH",
			body: JSON.stringify({ avatar }),
		});
	}

	addCard({ name, link }) {
		return this._request("/cards", {
			method: "POST",
			body: JSON.stringify({ name, link }),
		});
	}

	deleteCard(cardId) {
		return this._request(`/cards/${cardId}`, {
			method: "DELETE",
		});
	}

	changeLikeCardStatus(cardId, isLiked) {
		return this._request(`/cards/likes/${cardId}`, {
			method: isLiked ? "PUT" : "DELETE",
		});
	}
}
