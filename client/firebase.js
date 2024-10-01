// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyDuB5MlwLBSOgjxEy01p8VeewDDODUKWUY',
    authDomain: 'blog-4b077.firebaseapp.com',
    projectId: 'blog-4b077',
    storageBucket: 'blog-4b077.appspot.com',
    messagingSenderId: '1005872541111',
    appId: '1:1005872541111:web:6fba90552d6a8e6636cc32',
  };
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
