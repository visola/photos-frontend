import { inject, observer } from 'mobx-react';
import React from 'react';

import UploadContainer from './UploadContainer';
import UploadPreview from './UploadPreview';
import UploadProgress from './UploadProgress';

@inject('uploads')
@observer
export default class UploadsPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleIntersection = this.handleIntersection.bind(this);
    this.handleRef = this.handleRef.bind(this);
  }

  componentDidMount() {
    this.props.uploads.fetch();
  }

  handleIntersection(intersections) {
    if (intersections[0].isIntersecting) {
      this.props.uploads.fetchNextPage();
    }
  }

  handleRef(el) {
    if (el == null) {
      return;
    }

    this.observer = new IntersectionObserver(this.handleIntersection, {root: el, rootMargin: '0px 0px 1000px 0px'});
  }

  render() {
    return <UploadContainer>
      <UploadProgress />
      <div className="image-previews" ref={this.handleRef}>
        {this.props.uploads.map((upload) => <UploadPreview key={upload.id} upload={upload} />)}
        {this.renderThresholdElement()}
      </div>
    </UploadContainer>
  }

  renderThresholdElement() {
    const style = {
      height: '2px',
      width: '100%',
    };

    return <div
      ref={(el) => el != null && this.observer && this.observer.observe(el)}
      style={style}
    />;
  }
}
