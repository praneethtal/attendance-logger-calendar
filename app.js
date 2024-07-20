import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth,onAuthStateChanged, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'
import { getDatabase, ref,push,child, get, set, onValue,remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD4L1tqUZp22ZTtrnWTMBig4VlhtttgyRY",
    authDomain: "attencal-planner.firebaseapp.com",
    projectId: "attencal-planner",
    storageBucket: "attencal-planner.appspot.com",
    messagingSenderId: "794458371715",
    appId: "1:794458371715:web:1cee2cdd0f3f25b5d20db6",
    databaseURL: "https://attencal-planner-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

document.getElementById("sign-in-btn").addEventListener("click", function(){
    const inmail = document.getElementById("email-in").value;
    const inpass = document.getElementById("pass-in").value;
    document.getElementById("pass-in").value = "";
    signInWithEmailAndPassword(auth, inmail, inpass)
    .then((userCredential) => { 
      console.log("Logged in!");
      sessionStorage.setItem("user-credentials", JSON.stringify(userCredential));
      get(ref(database, `users/${userCredential.user.uid}/courses`)).then((snap) => {
        sessionStorage.setItem('courses', JSON.stringify(snap.val()));
        window.location.href = "home.html";
      })
      
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
      });
})

