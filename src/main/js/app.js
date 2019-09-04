import { Provider } from 'mobx-react';
import React from 'react';
import { render } from 'react-dom';
import stores from './stores';

import Application from './containers/Application';

const ApplicationWithState = () => (
  <Provider {...stores}>
    <Application />
  </Provider>
);

render(<ApplicationWithState />, document.getElementById('container'));
