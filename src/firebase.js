import {getFirestore} from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCpBbcJauNKy1SejWyArjYhvjZmTOBbgRY",
  authDomain: "dropbox-5141e.firebaseapp.com",
  projectId: "dropbox-5141e",
  storageBucket: "dropbox-5141e.appspot.com",
  messagingSenderId: "872613773414",
  appId: "1:872613773414:web:414d8f3ff0d6d77d126da7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);