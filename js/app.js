import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore,collection,updateDoc,setDoc,doc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAEfuVGKF63-CI-CTgiYxMkah1glxl-dPg",
  authDomain: "e-voting-system-b76be.firebaseapp.com",
  projectId: "e-voting-system-b76be",
  storageBucket: "e-voting-system-b76be.appspot.com",
  messagingSenderId: "378603345053",
  appId: "1:378603345053:web:c32a8c7c9d2047ab7d7074",
  measurementId: "G-9JBN5V0L9K"
};

export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
console.log("Firebase has been initialized");

if (database)
{
    console.log("firestore database is initiated");
}
else{
    console.log("firestore databse initialisation is failed");
}
