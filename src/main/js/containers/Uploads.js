import { Divider, Loader } from 'semantic-ui-react';
import { DragDrop } from '@uppy/react';
import { inject, observer } from 'mobx-react';
import React from 'react';

@inject('security', 'uploads', 'thumbnails')
@observer
export default class Uploads extends React.Component {
  constructor(props) {
    super(props);

    props.uploads.initializeUppy()
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
  }

  componentWillMount() {
    this.props.uploads.fetch()
      .then(() => {
        this.props.uploads.forEach((u) => {
          const timerId = setInterval(() => {
            this.props.thumbnails.fetchById(u.id)
              .then((d) => {
                if (d) {
                  clearInterval(timerId);
                }
              });
          }, 1000);
        });
      });
    this.props.uploads.uppy.on('upload-success', this.handleUploadSuccess);
  }

  componentWillUnmount() {
    const { uploads } = this.props;
    uploads.uppy.off('upload-success', this.handleUploadSuccess);
    uploads.closeUppy();
  }

  handleUploadSuccess() {
    this.props.uploads.fetch();
  }

  render() {
    return <React.Fragment>
      <DragDrop
        height="120px"
        uppy={this.props.uploads.uppy}
        width="400px"
      />
      <Divider />
      {this.renderPhotos()}
    </React.Fragment>;
  }

  renderPhotos() {
    if (this.props.uploads.loading > 0) {
      return <Loader />
    }

    const { token } = this.props.security;
    const { thumbnails } = this.props;

    return <div className="image-previews">
      {this.props.uploads.map((p) => {
        if (thumbnails.findById(p.id)) {
          return <img src={`/api/v1/thumbnails/${p.id}?auth=${token}`} key={p.id} />;
        }

        return <img src="empty-image.png" key={p.id} />;
      })}
    </div>;
  }
}
