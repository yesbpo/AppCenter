import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD0EhYba-1GhFCrxzLlV_YuMIwNnigCr0U",
    authDomain: "appcenter-f34ac.firebaseapp.com",
    projectId: "appcenter-f34ac",
    storageBucket: "appcenter-f34ac.appspot.com",
    messagingSenderId: "285747028626",
    appId: "1:285747028626:web:c4a4b57d153369759cbc4b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

export {app, firestore, auth, storage};