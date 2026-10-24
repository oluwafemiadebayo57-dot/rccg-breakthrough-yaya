import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore, Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDOiJ8lsZyYdKaH1HXKj4NlSAzB41V4xFI",
  authDomain: "qol-asaph.firebaseapp.com",
  projectId: "qol-asaph",
  storageBucket: "qol-asaph.firebasestorage.app",
  messagingSenderId: "772867584189",
  appId: "1:772867584189:web:64f1ed5ee064dd958b87d4",
  measurementId: "G-BNFRD4TKZ1"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const storage = getStorage(app);

// Explicitly type db as Firestore so TypeScript doesn't complain
let db: Firestore;

try {
  // Force long polling to prevent the "Could not reach Cloud Firestore backend" error
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
} catch (error) {
  // If it's already initialized, grab the existing instance
  db = getFirestore(app);
}

export { app, auth, db, storage };