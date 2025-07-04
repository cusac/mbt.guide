import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import * as firebaseui from 'firebaseui';
import axios from 'axios';
import qs from 'querystring';
import config, { resources } from '../config';
import httpClient from './http-client.service';
// import * as auth from './auth.service';
import repository from './repository.service';
import authInterceptor from './auth-interceptor.service';
import stats from './stats.service';
import search from './search.service';

export * from './video.service';
export * from './youtube.service';

const firebaseConfig = {
  apiKey: 'AIzaSyAn6loR5s_OC4aqA-nlMfpwOH2BogTM79g',
  authDomain: 'mbt-guide-d9b1b.firebaseapp.com',
  databaseURL: 'https://mbt-guide-d9b1b.firebaseio.com',
  projectId: 'mbt-guide-d9b1b',
  storageBucket: 'gs://mbt-guide-d9b1b.appspot.com/',
  messagingSenderId: '461006931750',
  appId: '1:461006931750:web:3c39f2584c45ac7c',
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

axios.defaults.baseURL = config.serverURI;

// Replace default serializer with one that works with Joi validation
axios.defaults.paramsSerializer = function (params) {
  return qs.stringify(params);
};

// Initialize the repository
(repository as any).install({ httpClient, log: true, resources });

export {
  firebaseApp,
  firebaseAuth,
  firebaseui,
  httpClient,
  repository,
  // auth,
  authInterceptor,
  stats,
  search,
  firestore,
};
