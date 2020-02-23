// @flow

import React from 'reactn';
import { firebase, firebaseAuth, auth } from 'services';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { toast } from 'react-toastify';

//TODO: Import test users
const testUsers = ['test@superadmin.com', 'test@admin.com'];

const Auth = ({ setLoading }: { setLoading: boolean => void }) => {
  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: async result => {
        setLoading(true);
        const idToken = await firebaseAuth.currentUser.getIdToken();
        const { displayName } = firebaseAuth.currentUser;

        let { emailVerified } = result.user;

        // TODO: Handle login errors
        try {
          emailVerified && (await auth.login({ idToken, displayName }));
        } catch (err) {
          console.error('LOGIN ERROR:', err);
          if (err.data.message === 'Account is inactive.') {
            emailVerified = false;
          }
          toast.error('There was an error logging into your account.');
        }

        if (!emailVerified && !testUsers.includes(firebaseAuth.currentUser.email)) {
          toast.info(
            'You need to activate your account. An activation email has been sent to your address.',
            {
              autoClose: false,
            }
          );
          firebase
            .auth()
            .currentUser.sendEmailVerification()
            .catch(function(error) {
              console.error('EMAIL error:', error);
            });
        }

        setLoading(false);
        return false;
      },
      uiShown: function() {
        // Grab the password for login to support super admin login
        const submitButton: any = document.getElementsByClassName('firebaseui-id-submit')[0];
        const emailInput: any = document.getElementsByClassName('firebaseui-id-email')[0];
        const passwordInput: any = document.getElementsByClassName('firebaseui-id-password')[0];
        if (submitButton && passwordInput && emailInput) {
          submitButton.onclick = async e => {
            if (testUsers.includes(emailInput.value)) {
              e.stopPropagation();
              await auth.login({ email: emailInput.value, password: passwordInput.value });
              setLoading(false);
            }
          };
        }
        return false;
      },
    },
    signInFlow: 'popup',
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        signInMethod: firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
        requireDisplayName: true,
      },
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
  };
  return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />;
};

export default Auth;
