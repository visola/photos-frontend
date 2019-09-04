import axios from 'axios';
import { action, computed, observable } from 'mobx';

export default class Collection {
  @observable data = [];
  @observable error = null;
  @observable loading = 0;
  @observable saving = false;
  @observable ids = {};

  get baseApi() {
    throw new Error('No base API defined');
  }

  @action
  addOne(datum) {
    this.data.push(datum);
    this.ids[datum.id] = datum;
  }

  @action
  create(datum) {
    this.saving = true;
    return axios.post(this.baseApi, datum)
      .then((response) => {
        this.addOne(response.data);
        this.saving = false;
        return this;
      })
      .catch((error) => this.handleError(error));
  }

  filter(callback) {
    return this.data.filter(callback);
  }

  @action
  fetch() {
    this.loading++;
    return axios.get(this.baseApi)
      .then((response) => {
        this.setData(response.data);
        this.loading--;
        return this;
      })
      .catch((error) => this.handleError(error));
  }

  @action
  fetchById(id) {
    if (this.ids[id]) {
      return Promise.resolve(this.findById(id));
    }

    this.loading++;
    return axios.get(`${this.baseApi}/${id}`)
      .then((response) => {
        this.addOne(response.data);
        this.loading--;
        return response.data;
      }).catch((error) => this.handleError(error));
  }

  findById(id) {
    return this.ids[id];
  }

  forEach(callback) {
    return this.data.forEach(callback);
  }

  @computed
  get length() {
    return this.data.length;
  }

  @computed
  get isEmpty() {
    return this.length === 0;
  }

  @action
  handleError(error) {
    this.error = error;
    this.loading--;
    this.saving = false;
  }

  map(callback) {
    return this.data.map(callback);
  }

  @action
  update(datum) {
    this.saving = true;
    return axios.put(`${this.baseApi}/${datum.id}`, datum)
      .then(({data}) => {
        const indexOf = this.data.findIndex(d => d.id === data.id);

        const newArray = this.data;
        newArray[indexOf] = data;

        this.setData(newArray);
        this.saving = false;
        return this;
      })
      .catch((error) => this.handleError(error));
  }

  @action
  saveOne(datum) {
    if (datum.id == null) {
      return this.create(datum);
    }
    return this.update(datum);
  }

  @action
  setData(newData) {
    this.data = newData;
    newData.forEach(d => this.ids[d.id] = d);
  }
}