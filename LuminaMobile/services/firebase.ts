import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Identical Config for shared DB access
const firebaseConfig = {
    apiKey: "AIzaSyBJHdp5SAdj9hz6LPZvgGyDLP6MsjbDIVQ",
    authDomain: "studio-8325692364-3fde2.firebaseapp.com",
    projectId: "studio-8325692364-3fde2",
    storageBucket: "studio-8325692364-3fde2.firebasestorage.app",
    messagingSenderId: "910721155812",
    appId: "1:910721155812:web:72ca5b914265a0d52862f1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
