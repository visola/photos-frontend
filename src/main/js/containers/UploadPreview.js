import { inject, observer } from 'mobx-react';
import React from 'react';

@inject('security')
@observer
export default class UploadPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };

    this.handleIntersection = this.handleIntersection.bind(this);
    this.handleRef = this.handleRef.bind(this);
  }

  handleIntersection(intersections) {
    if (intersections[0].isIntersecting) {
      this.setState({ visible: true });
      this.observer.unobserve(intersections[0].target);
    }
  }

  handleRef(el) {
    if (el == null) {
      return;
    }

    this.observer = new IntersectionObserver(this.handleIntersection, {root: el.parentElement, rootMargin: '200px 0px', thresholds: [0, 1.0]});
    this.observer.observe(el);
  }

  render() {
    const { upload } = this.props;

    if (upload.thumbnailAvailable && this.state.visible) {
      return <img ref={this.handleRef} src={`/api/v1/thumbnails/${upload.id}?auth=${this.props.security.token}`} />;
    }
    
    return <img ref={this.handleRef} src="empty-image.png" />
  }
}