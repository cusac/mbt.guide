// @flow

import * as firebase from 'firebase/app';
import firebaseui from 'firebaseui';
import 'firebase/auth';
import 'firebase/firestore';
import youtube from './youtube';

const app = firebase.initializeApp({
  apiKey: 'AIzaSyAn6loR5s_OC4aqA-nlMfpwOH2BogTM79g',
  authDomain: 'mbt-guide-d9b1b.firebaseapp.com',
  databaseURL: 'https://mbt-guide-d9b1b.firebaseio.com',
  projectId: 'mbt-guide-d9b1b',
  storageBucket: 'gs://mbt-guide-d9b1b.appspot.com/',
  messagingSenderId: '461006931750',
  appId: '1:461006931750:web:3c39f2584c45ac7c',
});

const auth = app.auth();
const db = app.firestore();

export { auth, db, firebase, firebaseui, youtube };

export default app;
