// @flow

import * as React from 'react';
import { authUI, firebase } from 'services';

const Auth = () => {
  const ref = React.createRef();
  React.useEffect(() => {
    authUI.start(ref.current, {
      callbacks: {
        signInSuccessWithAuthResult: () => false,
      },
      signInFlow: 'popup',
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
    });
  }, []);
  return <div ref={ref} />;
};

export default Auth;
