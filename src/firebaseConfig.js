import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider  } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA0er73W9zhHtDhkpg0isiNDMdPx2qZXWw",
  authDomain: "group9cloud-f4d5e.firebaseapp.com",
  projectId: "group9cloud-f4d5e",
  storageBucket: "group9cloud-f4d5e.firebasestorage.app",
  messagingSenderId: "641107898980",
  appId: "1:641107898980:web:24bc8c3b98e286cdade571"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };

