// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClCPrjWEoTEHF265qMjPz6GqmFT8zZZ6U",
  authDomain: "salem-game-df9df.firebaseapp.com",
  projectId: "salem-game-df9df",
  storageBucket: "salem-game-df9df.appspot.com",
  messagingSenderId: "672506381741",
  appId: "1:672506381741:web:6741ab0740aec49c9ecd24",
  measurementId: "G-CJN6YH5F8C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app)
const auth = getAuth(app)
const analytics = getAnalytics(app);

export { database, auth };