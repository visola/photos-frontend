import { Button } from 'semantic-ui-react';
import React from 'react';

export default class Login extends React.Component {
  render() {
    const redirectUrl = encodeURIComponent(`${location.href}authenticate/oauth2callback`)
    return <p className="login">
      <Button primary href={`/authenticate/google?redirectUrl=${redirectUrl}`}>
        Login with Google
      </Button>
    </p>;
  }
}