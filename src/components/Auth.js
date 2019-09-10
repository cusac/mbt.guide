// @flow

// import React from 'reactn';
import React from 'reactn';
import * as services from 'services';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const Auth = ({ setLoading }: { setLoading: boolean => void }) => {
  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: async result => {
        setLoading(true);
        const idToken = await services.firebaseAuth.currentUser.getIdToken();

        // TODO: Handle loging errors
        await services.auth.login(idToken);

        setLoading(false);
        return false;
      },
    },
    signInFlow: 'popup',
    signInOptions: [
      services.firebase.auth.EmailAuthProvider.PROVIDER_ID,
      services.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
  };
  return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={services.firebase.auth()} />;
};

export default Auth;
