// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    addDoc
} from "firebase/firestore";
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
            return;
        } else {
          let RealPassword = null;
            snapshot.docs.forEach((doc) => 
            {
                RealPassword = doc.data().password;
            });
            if (RealPassword !== loginForm.password.value) {
                errorLogger.innerHTML = "Incorrect password! Please try again, or make a new account!";
                return;
            } else {
                errorLogger.innerHTML = "Logging you in!";
            };
        };
    });
});

// Signup code
const signupForm = document.querySelector("#signup");
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const Query = query(UsersCollection, where("email", "==", signupForm.email.value.toLowerCase()));
    const errorLogger = signupForm.querySelector("p[name=\"errorMessage\"]");
    function removeSpaces() {
        const emailArr = signupForm.email.value.toLowerCase().split("");
        emailArr.forEach((i) => {
            if (i === " ") {
                emailArr.splice(emailArr.indexOf(" "), 1);
            };
        });
        signupForm.email.value = emailArr.join("");
    };
    removeSpaces();
    getDocs(Query).then(snapshot => {
        if (snapshot.size === 1) {
            errorLogger.innerHTML = "Email address already exists! Try logging in instead!";
            return;
        };
    });
    
    if (signupForm.email.value.split("@").length === 1) {
        errorLogger.innerHTML = "Sorry! You need to have a domain! Random domains are fine but you need to have a domain!";
        return;
    } else if (signupForm.email.value.toLowerCase().split("@")[signupForm.email.value.split("@").length - 1] === " " || signupForm.email.value.split("@")[signupForm.email.value.split("@").length - 1] === "") {
        errorLogger.innerHTML = "Sorry! You need to have a domain! Random domains are fine but you need to have a domain!";
    }
    if (signupForm.email.value.endsWith("crapmail.ml") || signupForm.email.value.endsWith("crapmailml")  || signupForm.email.value.endsWith("crapmailml")) {
        errorLogger.innerHTML = "Sorry! That email domain is for staff/admins only! Please try another email domain.";
        return;
    };
    addDoc(UsersCollection, {
        dispName: signupForm.dispName.value,
        email: signupForm.email.value,
        password: signupForm.password.value
    }).then(() => {
        errorLogger.innerHTML = "Your account has been made! Loading your inbox...";
    });
});

// Switch to signup button
const switchToSignUp = document.querySelector("#switchToSignUp");
switchToSignUp.addEventListener("click", () => {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
    switchToSignUp.style.display = "none";
    switchToLogin.style.display = "block";
});

// Signup to login button
const switchToLogin = document.querySelector("#switchToLogin");
switchToLogin.addEventListener("click", () => {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    switchToSignUp.style.display = "block";
    switchToLogin.style.display = "none";
});