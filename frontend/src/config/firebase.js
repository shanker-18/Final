import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC-P_cpIMuD8bVIPI1o3FKj94JC6AfhmGw',
  authDomain: 'freelancehub-2a115.firebaseapp.com',
  projectId: 'freelancehub-2a115',
  storageBucket: 'freelancehub-2a115.firebasestorage.app',
  messagingSenderId: '1002406288452',
  appId: '1:1002406288452:web:190959259668818e6cb011',
  measurementId: 'G-Q85SKKM4G6',
};

// Initialize Firebase core services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
export default app;
