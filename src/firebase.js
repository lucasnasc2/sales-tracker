// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvhd3nKKeWixfDPNtVqbvEmrolaR11rKY",
  authDomain: "sales-tracker-248a2.firebaseapp.com",
  projectId: "sales-tracker-248a2",
  storageBucket: "sales-tracker-248a2.appspot.com",
  messagingSenderId: "673388427816",
  appId: "1:673388427816:web:6d07965d086f67b84ed31d",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp

