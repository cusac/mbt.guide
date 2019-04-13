// @flow

import * as React from 'react';
import { auth, firebase, firebaseui } from 'services';

const Auth = () => {
  const ref = React.createRef();
  React.useEffect(() => {
    const ui = new firebaseui.auth.AuthUI(auth);
    ui.start(ref.current, {
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
