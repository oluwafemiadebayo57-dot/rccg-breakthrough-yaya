import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore, Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAVfl6rL_ZGEAODWZ20noT2utZMQNvOBmA",
  authDomain: "rccg-yaya.firebaseapp.com",
  projectId: "rccg-yaya",
  storageBucket: "rccg-yaya.firebasestorage.app",
  messagingSenderId: "329582590544",
  appId: "1:329582590544:web:b06638a2ee9af12990af55",
  measurementId: "G-VPJGW0XBK9"
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