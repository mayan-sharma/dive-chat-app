import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// config
const firebaseConfig = {
    apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
    authDomain: "chat-app-56619.firebaseapp.com",
    databaseURL: "https://chat-app-56619-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chat-app-56619",
    storageBucket: "chat-app-56619.appspot.com",
    messagingSenderId: "821681602254",
    appId: "1:821681602254:web:9db530debaf13c04b85a9f"
};

// initalize app
const app = initializeApp(firebaseConfig);

// auth
const auth = getAuth();
const provider = new GoogleAuthProvider();

// db
const db = getDatabase(app);

// login with google
const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
        .then(res => {
            console.log('Logged in successfully');
            writeUserData(res.user.uid, res.user.displayName);
        })
        .catch(err => {
            console.error(err);
        });
}

// logout
const logout = () => {
    signOut(auth);
}

// write user data
const writeUserData = (userId, name) => {
    set(ref(db, 'users/' + userId), {
        userId,
        name
    });
}

// generates a chat id
const getChatId = (id1, id2) => {
    if (id1 < id2) {
        return id1 + '-' + id2;
    } else return id2 + '-' + id1;
}

export {
    app,
    auth,
    provider,
    loginWithGoogle,
    logout,
    db,
    getChatId
}