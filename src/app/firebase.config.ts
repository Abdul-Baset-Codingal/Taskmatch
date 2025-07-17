// firebase.config.ts or .js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB6gi2isM9NPNMUaW5HoDj8TUDUhezJNd0",
    authDomain: "taskmatch-e470b.firebaseapp.com",
    projectId: "taskmatch-e470b",
    storageBucket: "taskmatch-e470b.appspot.com", // ✅ This is required
    messagingSenderId: "1023693851471",
    appId: "1:1023693851471:web:7eb2fefdf7520af4ee933a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
