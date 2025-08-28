// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcTndm3_mbCi3TR4JQSW5C-wFEuruIdIc",
  authDomain: "joblinkiscim.firebaseapp.com",
  projectId: "joblinkiscim",
  storageBucket: "joblinkiscim.firebasestorage.app",
  messagingSenderId: "338100372457",
  appId: "1:338100372457:web:7be9dd2b8ca82e2f318178",
  measurementId: "G-GFH29448SZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);