import { inject, observer } from 'mobx-react';
import { Loader } from 'semantic-ui-react';
import React from 'react';

import UploadContainer from './UploadContainer';
import UploadProgress from './UploadProgress';

@inject('security', 'uploads', 'thumbnails')
@observer
export default class UploadsPage extends React.Component {
  componentDidMount() {
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
          }, 5000);
        });
      });
  }

  render() {
    if (this.props.uploads.loading) {
      return <Loader />;
    }

    const { token } = this.props.security;
    const { thumbnails } = this.props;

    return <UploadContainer>
      <UploadProgress />
      {this.props.uploads.map((p) => {
        if (thumbnails.findById(p.id)) {
          return <img src={`/api/v1/thumbnails/${p.id}?auth=${token}`} key={p.id} />;
        }

        return <img src="empty-image.png" key={p.id} />;
      })}
    </UploadContainer>
  }
}
