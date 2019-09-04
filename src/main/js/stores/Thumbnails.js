import { action } from 'mobx';
import axios from 'axios';
import Collection from './Collection';

export default class Thumbnails extends Collection {
  get baseApi() {
    return '/api/v1/thumbnails';
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
        return null;
      }).catch(() => {
        // Do nothing
      });
  }
}