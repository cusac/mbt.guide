// @flow

// import React from 'reactn';
import React, { useGlobal } from 'reactn';
import { firebase, auth, authService } from 'services';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const Auth = ({ setLoading }: { setLoading: boolean => void }) => {
  const [state, setState] = useGlobal();
  React.useEffect(() => {
    console.log('state:', state);
  }, state);
  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: async result => {
        setLoading(true);

        const idToken = await auth.currentUser.getIdToken();

        // const promise = new Promise(res =>
        //   setTimeout(() => {
        //     res('cool');
        //   }, 1000)
        // );
        // const cool = await promise;

        await authService.login(idToken);

        // console.log('user', response.data);
        setLoading(false);
      },
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
