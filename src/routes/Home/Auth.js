// @flow

import * as React from 'react';
import { firebase } from 'services';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const Auth = () => {
  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
  };
  return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />;
};

export default Auth;
