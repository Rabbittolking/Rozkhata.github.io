import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAqsDSlP4KFITZK18YKzlpzQHNyNw8z75I",
  authDomain: "rozkhata-98cf6.firebaseapp.com",
  projectId: "rozkhata-98cf6",
  storageBucket: "rozkhata-98cf6.firebasestorage.app",
  messagingSenderId: "476353724508",
  appId: "1:476353724508:web:1234567890abcdef" // Make sure to configure a web app in Firebase Console for proper web auth
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
