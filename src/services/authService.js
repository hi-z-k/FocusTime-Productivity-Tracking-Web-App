import {
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    OAuthProvider,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');


const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
        .then(credential => credential.user)
}

const logOut = () => {
    return signOut(auth)
}

const logIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
        .then(credential => credential.user)
}

const whileLogIn = (callback) => {
    return onAuthStateChanged(auth, (user) => {
        callback(user)
    })
}

const logInExternal = async (providerName) => {
    let provider;

    switch (providerName) {
        case 'google': provider = googleProvider; break;
        case 'facebook': provider = facebookProvider; break;
        case 'apple': provider = appleProvider; break;
        default: throw new Error("Unsupported provider");
    }
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        throw error;
    }
};


export { signUp, logIn, logOut, logInExternal, whileLogIn }