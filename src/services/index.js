// @flow

import * as firebase from 'firebase/app';
import firebaseui from 'firebaseui';
import 'firebase/auth';
import 'firebase/firestore';

const app = firebase.initializeApp({
  apiKey: 'AIzaSyBvFnPQyZ2zCKbn3ePtfzdNN3Io1KlyVXU',
  authDomain: 'mbt-guide.firebaseapp.com',
  databaseURL: 'https://mbt-guide.firebaseio.com',
  projectId: 'mbt-guide',
  storageBucket: 'mbt-guide.appspot.com',
  messagingSenderId: '634656320956',
});

const auth = app.auth();
const db = app.firestore();
const authUI = new firebaseui.auth.AuthUI(auth);

export { auth, authUI, db, firebase, firebaseui };

export default app;
