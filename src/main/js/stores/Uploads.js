import axios from 'axios';
import { action, observable } from 'mobx';
import Collection from './Collection';

export default class Uploads extends Collection {
  @observable uploadsProgress = 0;
  @observable uploadsTotal = 0;

  constructor(security) {
    super();

    this.pagesLoaded = new Set();
    this.pageNumber = 1;
    this.pageSize = 50;
    this.totalPages = 0;
    this.uploads = [];
    this.security = security;
  }

  @action
  addIfNew(toAdd) {
    const uploads = this.data;
    toAdd.forEach((upload) => {
      const indexOf = this.data.findIndex((u) => u.id === upload.id);
      if (indexOf >= 0) {
        return;
      }

      uploads.push(upload);
    });
    uploads.sort((u1, u2) => u1.uploadedAt - u2.uploadedAt);
    this.data = uploads;
  }

  get baseApi() {
    return '/api/v1/uploads';
  }

  @action
  fetch(pageToFetch=this.pageNumber) {
    this.loading++;
    return axios.get(`${this.baseApi}?pageSize=${this.pageSize}&pageNumber=${pageToFetch}`)
      .then((response) => {
        const page = response.data;
        this.totalPages = page.totalPages;

        this.addIfNew(page.data);
        this.loading--;
        return this;
      })
      .catch((error) => this.handleError(error));
  }

  @action
  fetchNextPage() {
    if (this.pageNumber == this.totalPages) {
      return;
    }

    this.pageNumber = this.pageNumber + 1;
    this.fetch();
  }

  @action
  setData(page) {
    this.data = page.data;
  }

  @action
  uploadFiles(filesToUpload) {
    this.uploads = this.uploads.filter((u) => u.progress !== 100);
    this.uploadsProgress = 0;

    const promises = [];
    filesToUpload.forEach((file) => {
      const upload = { file, progress: 0 };
      this.uploads.push(upload);

      let resolve;
      const promise = new Promise((r) => resolve = r);
      promises.push(promise);

      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => {
        upload.progress = Math.round(100 * e.loaded / e.total);
        this.uploadsProgress = this.uploads.map((u) => u.progress)
          .reduce((t,n) => t + n, 0);
      });

      xhr.upload.addEventListener('load', (e) => {
        upload.progress = 100;
        this.uploadsProgress = this.uploads.map((u) => u.progress)
          .reduce((t,n) => t + n, 0);
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) {
          return;
        }
        this.addIfNew([JSON.parse(xhr.response)]);
        resolve();
      }

      xhr.open('POST', '/api/v1/uploads', true);

      xhr.setRequestHeader('Authorization', `Bearer ${this.security.token}`)
      xhr.send(formData);
    });

    Promise.all(promises).then(() => this.fetch(1));
    this.uploadsTotal = 100 * this.uploads.length;
  }
}
