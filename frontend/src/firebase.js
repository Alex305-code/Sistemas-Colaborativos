// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDStjmcNT3LPHOdtsOECUBbshONTJXMXOc",
  authDomain: "sistemas-colaborativos-65dbc.firebaseapp.com",
  projectId: "sistemas-colaborativos-65dbc",
  storageBucket: "sistemas-colaborativos-65dbc.firebasestorage.app",
  messagingSenderId: "354541957016",
  appId: "1:354541957016:web:5716798d6c268bddf0c5ed",
  measurementId: "G-W5XRFC71KK"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
