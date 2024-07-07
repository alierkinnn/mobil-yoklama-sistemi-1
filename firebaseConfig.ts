// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getDatabase } from "firebase/database";
import {getStorage} from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCliwG2t5ehQQuU7Tt9lxnk2FLTLBCtWAU",
  authDomain: "mobil-yoklama-sistemi-e2d6b.firebaseapp.com",
  projectId: "mobil-yoklama-sistemi-e2d6b",
  storageBucket: "mobil-yoklama-sistemi-e2d6b.appspot.com",
  messagingSenderId: "1053333415392",
  appId: "1:1053333415392:web:b0f67c8651697ae6533785"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getDatabase(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);