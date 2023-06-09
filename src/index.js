// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    onSnapshot,
    deleteDoc,
    doc,
    getDoc,
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

// Initialize Mails collection
const mailsCollection = collection(firestore, "Mails");

// Real code

// Animation code
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        } else {
            entry.target.classList.remove("show");
        }
    });
});

setInterval(() => {
    const animatedElements = document.querySelectorAll(".animated");
    animatedElements.forEach(element => observer.observe(element));
}, 1);

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
                errorLogger.innerHTML = "Incorrect password! Please try again, or make a new account and mail \"support@crapmail.ml\"!";
                return;
            } else {
                errorLogger.innerHTML = "Logging you in!";
                localStorage.setItem("accountDetails", JSON.stringify({ email: loginForm.email.value, password: loginForm.password.value }));
                loadMailViewer();
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
        localStorage.setItem("accountDetails", JSON.stringify({ email: signupForm.email.value, password: signupForm.password.value }));
        loadMailViewer();
    });
});

// Switch to signup button
const switchToSignUp = document.querySelector("#switchToSignUp");
switchToSignUp.addEventListener("click", () => {
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    switchToSignUp.classList.add("hidden");
    switchToLogin.classList.remove("hidden");
});

// Signup to login button
const switchToLogin = document.querySelector("#switchToLogin");
switchToLogin.addEventListener("click", () => {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
    switchToSignUp.classList.remove("hidden");
    switchToLogin.classList.add("hidden");
});

// Email viewer
const viewMailParentDiv = document.querySelector("#viewMail");
const viewMailDiv = document.querySelector("#mails");
const viewSpecificMailDiv = document.querySelector("#mail");

// Makes an array with all the mails that the user has recieved or sent
let mails = [];

function loadMailViewer() {
    viewMailParentDiv.classList.remove("hidden");
    document.querySelector("#LoginSignup").classList.add("hidden");
    const toUserQuery = query(mailsCollection, where("to", "==", JSON.parse(localStorage.getItem("accountDetails"))["email"]));
    const fromUserQuery = query(mailsCollection, where("from", "==", JSON.parse(localStorage.getItem("accountDetails"))["email"]));
    // Checks for RECIEVED mail
    onSnapshot(toUserQuery, (snapshot) => {
        snapshot.forEach(doc => {
            const dispNameQuery = query(UsersCollection, where("email", "==", doc.data().from));
            getDocs(dispNameQuery).then(snapshot => {
                snapshot.docs.forEach(doc2 => {
                    const mailNode = document.createElement("div");
                    mailNode.id = doc.id;
                    mailNode.className = "mail animated";
                    const dispName = doc2.data().dispName;
                    mailNode.innerHTML = `<p>${doc.data().subject}<br>Sent by: ${dispName}</p>>`;
                    // Load specific mail
                    mailNode.addEventListener("click", () => {
                        const from = doc.data().from;
                        // dispName already defined
                        const subject = doc.data().subject;
                        const body = doc.data().body;
                        document.querySelector("#from").innerHTML = `Sent by: ${dispName} (${from})`;
                        document.querySelector("#subject").innerHTML = subject;
                        document.querySelector("#body").innerHTML = body;
                        document.querySelector("#mailId").innerHTML = doc.id;
                        viewSpecificMailDiv.classList.remove("hidden");
                        viewMailDiv.classList.add("hidden")
                    });
                    if (mails.indexOf(doc.id) === -1) {
                        mails.push(doc.id);
                        viewMailDiv.appendChild(mailNode);
                    }
                });
            });
        });
    });
    // Checks for SENT mail 
    onSnapshot(fromUserQuery, (snapshot) => {
        snapshot.forEach(doc => {
            const dispNameQuery = query(UsersCollection, where("email", "==", doc.data().to));
            getDocs(dispNameQuery).then(snapshot => {
                snapshot.docs.forEach(doc2 => {
                    const mailNode = document.createElement("div");
                    mailNode.id = doc.id;
                    mailNode.className = "mail animated";
                    const dispName = doc2.data().dispName;
                    mailNode.innerHTML = `<p>${doc.data().subject}<br>Sent to: ${dispName}</p>`;
                    // Load specific mail
                    mailNode.addEventListener("click", () => {
                        const to = doc.data().to;
                        // dispName already defined
                        const subject = doc.data().subject;
                        const body = doc.data().body;
                        document.querySelector("#from").innerHTML = `Sent to: ${dispName} (${to})`;
                        document.querySelector("#subject").innerHTML = subject;
                        document.querySelector("#body").innerHTML = body;
                        document.querySelector("#mailId").innerHTML = doc.id;
                        viewSpecificMailDiv.classList.remove("hidden");
                        viewMailDiv.classList.add("hidden")
                    });
                    if (mails.indexOf(doc.id) === -1) {
                        mails.push(doc.id);
                        viewMailDiv.appendChild(mailNode);
                    }
                });
            });
        });
    });
};

// Loads the mail viewer if the user has logged in once
if (localStorage.getItem("accountDetails") !== null) {
    const localStorageAccountDetails = JSON.parse(localStorage.getItem("accountDetails"));
    const currentEmail = localStorageAccountDetails["email"];
    const currentPassword = localStorageAccountDetails["password"];
    const Query = query(UsersCollection, where("email", "==", currentEmail));
    getDocs(Query).then(snapshot => {
        if (snapshot.size === 0) {
            localStorage.clear();
            location.reload();
        } else {
          let RealPassword = null;
            snapshot.docs.forEach((doc) => {
                RealPassword = doc.data().password;
            });
            if (RealPassword !== currentPassword) {
                localStorage.clear();
                location.reload();
            } else {
                loadMailViewer();
            };
        };
    });
};

// Deleting mail code
const deleteMailButton = document.querySelector("#deleteMail");
deleteMailButton.addEventListener("click", () => {
    const mailId = document.querySelector("#mailId").innerHTML;
    deleteDoc(doc(firestore, "Mails", mailId));
    viewSpecificMailDiv.classList.add("hidden");
    viewMailDiv.classList.remove("hidden");
    document.querySelector(`#${mailId}`).remove();
    mails.pop(mailId);
});

// Back to inbox Specific mail
const backToInboxSpecificButton = document.querySelector("#backToInboxSpecific");
backToInboxSpecificButton.addEventListener("click", () => {
    viewMailDiv.classList.remove("hidden");
    viewSpecificMailDiv.classList.add("hidden");
});

// Composing mail
const composeButton = document.querySelector("#composeButton");
const composeMailDiv = document.querySelector("#compose");
const composeMailForm = document.querySelector("#composeMailDetails");

composeButton.addEventListener("click", () => {
    composeButton.classList.add("hidden");
    composeMailDiv.classList.remove("hidden");
    viewMailDiv.classList.add("hidden");
    viewSpecificMailDiv.classList.add("hidden");
    composeMailForm.from.value = JSON.parse(localStorage.getItem("accountDetails"))["email"];
    composeMailForm.to.value = "";
    composeMailForm.subject.value = "";
    composeMailForm.body.value = "";
});

composeMailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let to = composeMailForm.to.value.toLowerCase();
    function removeSpaces() {
        const emailArr = to.split("");
        emailArr.forEach((i) => {
            if (i === " ") {
                emailArr.splice(emailArr.indexOf(" "), 1);
            };
        });
        to = emailArr.join("");
    }; removeSpaces();
    const toUserExistsQuery = query(UsersCollection, where("email", "==", to));
    getDocs(toUserExistsQuery).then((snapshot) => {
        if (snapshot.size === 0) {
            alert("User doesn\'t exist!");
            return;
        } else {
            const subject = composeMailForm.subject.value;
            let body = composeMailForm.body.value;
            body = body.replace(/\n/g, "<br>");
            addDoc(mailsCollection, {
                from: JSON.parse(localStorage.getItem("accountDetails"))["email"],
                to: to,
                subject: subject,
                body: body
            }).then(() => {
                alert("Email has been sent!");
                composeMailDiv.classList.add("hidden");
                viewMailDiv.classList.remove("hidden");
                composeButton.classList.remove("hidden");
            });
        };
    });
});

// Replying functionality
const replyButton = document.querySelector("#reply");
replyButton.addEventListener("click", () => {
    viewSpecificMailDiv.classList.add("hidden");
    composeButton.classList.add("hidden");
    composeMailDiv.classList.remove("hidden");
    composeMailForm.from.value = JSON.parse(localStorage.getItem("accountDetails"))["email"];
    getDoc(doc(firestore, "Mails", document.querySelector("#mailId").innerHTML)).then((snapshot) => {
        composeMailForm.to.value = snapshot.data().from;
        composeMailForm.subject.value = `RE: ${snapshot.data().subject}`;
        composeMailForm.body.value = `\n\n-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n${snapshot.data().body}`;
    });
});

// Logout functionality
const logoutButton = document.querySelector("#logout");
logoutButton.addEventListener("click", () => {
    localStorage.clear(); 
    location.reload();
});

// Go back to inbox compose
const backToInboxComposeButton = document.querySelector("#backToInboxCompose");
backToInboxComposeButton.addEventListener("click", () => {
    viewMailDiv.classList.remove("hidden");
    composeButton.classList.remove("hidden");
    composeMailDiv.classList.add("hidden");
});