// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtcYrFnL7I4bRHbRP7IDh57p2KJ1_M6PA",
  authDomain: "ethiomovie-1d2a0.firebaseapp.com",
  projectId: "ethiomovie-1d2a0",
  storageBucket: "ethiomovie-1d2a0.appspot.com",
  messagingSenderId: "45598090625",
  appId: "1:45598090625:web:03c571bb59c941b7a0f480",
  measurementId: "G-SSZPP24E17",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);