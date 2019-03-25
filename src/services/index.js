// @flow

import * as firebase from 'firebase/app';
import 'firebase/firestore';

const app = firebase.initializeApp({
  apiKey: 'AIzaSyBvFnPQyZ2zCKbn3ePtfzdNN3Io1KlyVXU',
  authDomain: 'mbt-guide.firebaseapp.com',
  databaseURL: 'https://mbt-guide.firebaseio.com',
  projectId: 'mbt-guide',
  storageBucket: 'mbt-guide.appspot.com',
  messagingSenderId: '634656320956',
});

const db = app.firestore();

export { db };

export default app;
