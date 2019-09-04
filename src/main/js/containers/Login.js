import { Button } from 'semantic-ui-react';
import React from 'react';

export default class Login extends React.Component {
  render() {
    return <p className="login">
      <Button primary href="/authenticate/google">
        Login with Google
      </Button>
    </p>;
  }
}