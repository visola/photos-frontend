import { inject, observer } from 'mobx-react';
import React from 'react';

@inject('uploads')
@observer
export default class UploadContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
    };
  }

  handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.dragging) {
      return;
    }

    this.setState({ dragging: true });
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ dragging: false });

    if (e.dataTransfer.items) {
      const filesToUpload = [];
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const item = e.dataTransfer.items[i];
        if (item.kind === 'file') {
          filesToUpload.push(item.getAsFile());
        }
      }
      this.props.uploads.uploadFiles(filesToUpload);
    }
  }

  handleUploadSuccess() {
    this.props.uploads.fetch();
  }

  render() {
    const classes = ["upload-container"];
    if (this.state.dragging) {
      classes.push("dragging");
    }

    return <div className={classes.join(" ")}
      onDrop={(e) => this.handleDrop(e)}
      onDragOver={(e) => this.handleDragOver(e)}
      onDragEnd={(e) => this.handleDragEnd(e)}
    >
      {this.props.children}
    </div>;
  }
}
