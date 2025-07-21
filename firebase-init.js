// firebase-init.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// TODO: It's best practice to load these from environment variables, not hardcode them.
// But for now, keeping them in a separate module is much better than in the HTML.
const firebaseConfig = {
  apiKey: "AIzaSyDtUXBJPq_MPTepf3iIHjVtVHg1Y56P1jk",
  authDomain: "rightnow-app-4e5bd.firebaseapp.com",
  projectId: "rightnow-app-4e5bd",
  storageBucket: "rightnow-app-4e5bd.appspot.com",
  messagingSenderId: "60805459677",
  appId: "1:60805459677:web:0e63876925fca489e6f534",
  measurementId: "G-N9R2R0BMZR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Auth and export it for use in other scripts
export const auth = getAuth(app);