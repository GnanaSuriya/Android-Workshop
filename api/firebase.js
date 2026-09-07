import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "googly-way-3lkcn",
  appId: "1:978553371934:web:45710614169b7a70d81d0f",
  apiKey: "AIzaSyAtwWhOiT-lW_7lXroIiXcLfsKmFAv7lKg",
  authDomain: "googly-way-3lkcn.firebaseapp.com",
  storageBucket: "googly-way-3lkcn.firebasestorage.app",
  messagingSenderId: "978553371934"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app, "ai-studio-androidworkshop-f7b1ebc6-fae8-45ab-aff4-f2529b5e5839");
export { collection, doc, setDoc, getDoc, updateDoc, getDocs };
