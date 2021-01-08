import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import React from 'react';
import { login } from 'store';
import { firebase, firebaseAuth } from '../services';
import { captureAndLog, toastError } from '../utils';

//TODO: Import test users
const testUsers = ['test@superadmin.com', 'test@admin.com'];

const Auth = ({ setLoading }: { setLoading: (arg0: boolean) => void }): any => {
  const dispatch = useDispatch();

  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: async (result: any) => {
        setLoading(true);
        const idToken = await (firebaseAuth as any).currentUser.getIdToken();
        const { displayName } = firebaseAuth.currentUser as any;

        let { emailVerified } = result.user;

        // TODO: Handle login errors
        try {
          emailVerified && (await dispatch(login({ idToken, displayName })));
        } catch (err) {
          if (err.data.message === 'Account is inactive.') {
            emailVerified = false;
            toastError('There was an error logging into your account.', err);
          } else {
            captureAndLog({ file: 'Auth', method: 'sendEmailVerification', err });
          }
        }

        if (!emailVerified && !testUsers.includes((firebaseAuth as any).currentUser.email as any)) {
          toast.info(
            'You need to activate your account. An activation email has been sent to your address.',
            {
              autoClose: false,
            }
          );
          (firebase as any)
            .auth()
            .currentUser.sendEmailVerification()
            .catch(function(err: any) {
              captureAndLog({ file: 'Auth', method: 'sendEmailVerification', err });
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
          submitButton.onclick = async (e: any) => {
            if (testUsers.includes(emailInput.value)) {
              e.stopPropagation();
              await dispatch(login({ email: emailInput.value, password: passwordInput.value }));
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
  return <StyledFirebaseAuth uiConfig={uiConfig as any} firebaseAuth={firebase.auth()} />;
};

export default Auth;
