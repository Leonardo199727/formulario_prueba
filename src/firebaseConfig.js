// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc,query, getDocs, onSnapshot} from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD0xXKVlpHaAKMDdbGV8s_LyKBh7Lsf_bQ",
    authDomain: "app-herramientas-ea65f.firebaseapp.com",
    projectId: "app-herramientas-ea65f",
    storageBucket: "app-herramientas-ea65f.appspot.com",
    messagingSenderId: "563144353866",
    appId: "1:563144353866:web:3def40a12657fe19481eb3",
    measurementId: "G-6KC8PCS1CT"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc,getDocs,query,onSnapshot };