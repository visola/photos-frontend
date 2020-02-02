import { action, observable } from 'mobx';
import Collection from './Collection';

export default class Uploads extends Collection {
  @observable uploadsProgress = 0;
  @observable uploadsTotal = 0;

  constructor(security) {
    super();
    this.security = security;
  }

  get baseApi() {
    return '/api/v1/uploads';
  }

  @action
  setData(page) {
    this.data = page.data;
  }

  @action
  uploadFiles(filesToUpload) {
    const uploads = [];
    this.uploadsProgress = 0;
    this.uploadsTotal = 100 * filesToUpload.length;

    filesToUpload.forEach((file) => {
      const upload = { file, progress: 0 };
      uploads.push(upload);

      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => {
        upload.progress = Math.round(100 * e.loaded / e.total);
        console.log(`Upload ${file.name} total: ${Math.round(100 * e.loaded / e.total)}`);

        this.uploadsProgress = uploads.map((u) => u.progress)
          .reduce((t,n) => t + n, 0);
      });

      xhr.upload.addEventListener('load', (e) => {
        upload.progress = 100;
        console.log(`Upload finished: ${file.name}`);

        this.uploadsProgress = uploads.map((u) => u.progress)
          .reduce((t,n) => t + n, 0);
      });

      xhr.open('POST', '/api/v1/uploads', true);

      xhr.setRequestHeader('Authorization', `Bearer ${this.security.token}`)
      xhr.send(formData);
    });
  }
}
