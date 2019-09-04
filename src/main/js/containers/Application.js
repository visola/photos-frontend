import { BrowserRouter, Route, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import Login from './Login';
import Uploads from './Uploads';
import TopMenu from './TopMenu';

@inject('security')
@observer
export default class Application extends React.Component {
  static propTypes = {
    security: PropTypes.object.isRequired,
  }

  render() {
    if (!this.props.security.isLoggedIn) {
      return <Login />;
    }

    return <BrowserRouter>
      <React.Fragment>
        <TopMenu />
        <div id="content">
          <Route exact path="/" component={Uploads} />
          <Route exact path="/uploads" component={Uploads} />
        </div>
      </React.Fragment>
    </BrowserRouter>;
  }
}
