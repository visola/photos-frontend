import axios from 'axios';
import { action, observable } from 'mobx';
import Collection from './Collection';

export default class Uploads extends Collection {
  @observable uploadsProgress = 0;
  @observable uploadsTotal = 0;
  @observable visibleStart = 0;
  @observable visibleEnd = 0;
  @observable total = 0;

  constructor(security) {
    super();

    this.pagesLoaded = new Set();
    this.pageNumber = 1;
    this.pageSize = 50;
    this.totalPages = 0;
    this.uploads = [];
    this.security = security;
  }

  get baseApi() {
    return '/api/v1/uploads';
  }

  @action
  fetch() {
    this.loading++;
    return axios.get(`${this.baseApi}?pageSize=${this.pageSize}&pageNumber=${this.pageNumber}`)
      .then((response) => {
        const page = response.data;
        this.totalPages = page.totalPages;

        this.data = [...this.data, ...page.data];
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
  setVisibleRange(start, end) {
    this.visibleStart = start;
    this.visibleEnd = end;
  }

  @action
  uploadFiles(filesToUpload) {
    this.uploads = this.uploads.filter((u) => u.progress !== 100);
    this.uploadsProgress = 0;

    filesToUpload.forEach((file) => {
      const upload = { file, progress: 0 };
      this.uploads.push(upload);

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

      xhr.open('POST', '/api/v1/uploads', true);

      xhr.setRequestHeader('Authorization', `Bearer ${this.security.token}`)
      xhr.send(formData);
    });

    this.uploadsTotal = 100 * this.uploads.length;
  }
}
