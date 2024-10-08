import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDsB8hFUSTct5GeKIuMhZm6WdBH4g5Lk0Y",
  authDomain: "mast-11030.firebaseapp.com",
  projectId: "mast-11030",
  storageBucket: "mast-11030.appspot.com",
  messagingSenderId: "664776929177",
  appId: "1:664776929177:android:6ae98752ed36ed86d36d08",
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();


const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
