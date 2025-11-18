// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfz2b_CKTr-mVr46wbEj0VtQLCGBn2oa4",
  authDomain: "collectpro-c1810.firebaseapp.com",
  projectId: "collectpro-c1810",
  storageBucket: "collectpro-c1810.firebasestorage.app",
  messagingSenderId: "802145646292",
  appId: "1:802145646292:web:96ad1730dd2c85e8766d41",
  measurementId: "G-JB941PRFK2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);