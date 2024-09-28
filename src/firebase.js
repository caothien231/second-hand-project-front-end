// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRMAHJyR2-9kC1grf-Wr_YzdKZkzVATr8",
  authDomain: "second-hand-project.firebaseapp.com",
  projectId: "second-hand-project",
  storageBucket: "second-hand-project.appspot.com",
  messagingSenderId: "537296215502",
  appId: "1:537296215502:web:f29961b8c4c27b35105f9f",
  measurementId: "G-CEM95RQ3NL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);