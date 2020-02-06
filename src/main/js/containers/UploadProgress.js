import { Card, Progress } from 'semantic-ui-react'
import { inject, observer } from 'mobx-react';
import React from 'react';

@inject('uploads')
@observer
export default class UploadProgress extends React.Component {
  render() {
    const { uploadsProgress, uploadsTotal } = this.props.uploads;
    if (uploadsTotal === uploadsProgress) {
      return null;
    }

    return <Card className="upload-progress">
      <Card.Content>
        <Card.Description>
          <Progress
            color="teal"
            percent={Math.round(100 * uploadsProgress / uploadsTotal)}
            size="tiny"
          >
            Uploading...
          </Progress>
        </Card.Description>
      </Card.Content>
    </Card>;
  }
}
