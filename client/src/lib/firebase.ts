import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2_Dx7aKmiHuTIirK0PMkHFJ7Wkf7gR5U",
  authDomain: "vault-link.firebaseapp.com",
  projectId: "vault-link",
  storageBucket: "vault-link.firebasestorage.app",
  messagingSenderId: "232333359997",
  appId: "1:232333359997:web:76be29d810d6a43ad8aa14",
  measurementId: "G-29WM8DFJLP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
export default app;