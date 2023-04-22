// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
    getFirestore,
    collection,
    query,
    where,
    getDocs
} from "firebase/firestore"
import { log } from "neo-async";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5hEjPS9f5irx9X2mVMpfnwk3Q64_36kA",
  authDomain: "crapmail-93713.firebaseapp.com",
  projectId: "crapmail-93713",
  storageBucket: "crapmail-93713.appspot.com",
  messagingSenderId: "848517842264",
  appId: "1:848517842264:web:44cd4f352f627b4ad2912d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

// Initialize Users collection
const UsersCollection = collection(firestore, "Users");

// Real code

// Login code
const loginForm = document.querySelector("#login");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const Query = query(UsersCollection, where("email", "==", loginForm.email.value.toLowerCase()));
    getDocs(Query).then(snapshot => {
      const errorLogger = loginForm.querySelector("p[name=\"errorMessage\"]");
        if (snapshot.size === 0) {
            errorLogger.innerHTML = "The mail given doesn\'t exist! Please try again or make a new account!";
        } else {
          let RealPassword = null;
            snapshot.docs.forEach((doc) => 
            {
                RealPassword = doc.data().password;
            });
            if (RealPassword !== loginForm.password.value) {
                errorLogger.innerHTML = "Incorrect password! Please try again, or make a new account!";
            } else {
                errorLogger.innerHTML = "Logging you in!";
            };
        };
    });
});