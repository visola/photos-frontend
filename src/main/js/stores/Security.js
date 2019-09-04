import axios from 'axios';
import { action, computed, observable } from 'mobx';

const ONE_MINUTE = 60 * 1000;
const TEN_MINUTES = 10 * ONE_MINUTE;

export default class Security {
  @observable token = null;

  constructor() {
    this.token = localStorage.token;

    // Check if user is logged in every minute
    setInterval(this.checkLoggedIn.bind(this), ONE_MINUTE);
  }

  @action
  checkLoggedIn() {
    if (!this.isLoggedIn) {
      delete axios.defaults.headers.common.Authorization;
    } else {
      axios.defaults.headers.common.Authorization = `Bearer ${this.token}`;
    }
  }

  @computed
  get data() {
    if (this.token == null) {
      return null;
    }

    return JSON.parse(atob(this.token.split('.')[1]));
  }

  @computed
  get expiration() {
    const { data } = this;
    if (data == null) {
      return null;
    }

    return data.exp * 1000;
  }

  @computed
  get isLoggedIn() {
    const { expiration } = this;
    if (expiration == null) {
      return false;
    }
    return expiration - TEN_MINUTES > Date.now();
  }

  @computed
  get user() {
    const { data } = this;

    if (data == null) {
      return {};
    }

    return {
      username: data.sub
    };
  }
}