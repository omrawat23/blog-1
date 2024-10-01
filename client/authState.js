import { atom, selector } from 'recoil';
import { auth } from './firebase';

export const authState = atom({
  key: 'authState',
  default: {
    isAuthenticated: false,
    user: null,
  },
});

export const initializeAuthState = selector({
  key: 'initializeAuthState',
  get: async () => {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          resolve({
            isAuthenticated: true,
            user: {
              username: user.displayName,
              photoURL: user.photoURL,
              email: user.email,
              uid: user.uid,
            },
          });
        } else {
          resolve({
            isAuthenticated: false,
            user: null,
          });
        }
        unsubscribe();
      });
    });
  },
});