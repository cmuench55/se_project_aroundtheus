export default class UserInfo {
  constructor({ nameSelector, aboutSelector }) {
    this._nameElement = document.querySelector(nameSelector);
    this._aboutElement = document.querySelector(aboutSelector);
  }

  getUserInfo() {
    return {
      name: this._nameElement.textContent,
      about: this._aboutElement.textContent,
    };
  }

  setUserInfo({ name, about }) {
    if (name !== undefined) {
      this._nameElement.textContent = name;
    }

    if (about !== undefined) {
      this._aboutElement.textContent = about;
    }
  }
}
