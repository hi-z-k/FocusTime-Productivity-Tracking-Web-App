import {
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    FacebookAuthProvider,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
        .then(credential => credential.user)
        .catch(error => { throw error; });
}

const logOut = () => {
    return signOut(auth)
}

const logIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
        .then(credential => credential.user)
        .catch(error => { throw error; });
}

const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email)
        .catch(error => { throw error; });
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
        default: throw new Error("Unsupported provider");
    }

    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
            return await signInWithRedirect(auth, provider);
        }
        throw error;
    }
};

export { signUp, logIn, logOut, logInExternal, whileLogIn, resetPassword }