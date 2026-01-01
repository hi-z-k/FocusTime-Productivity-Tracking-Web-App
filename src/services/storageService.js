import { collection, getDocs } from "firebase/firestore";

import { database } from "./firebase/firebaseConfig.js";



const userRef = collection(database, 'User Information')
const getUsers = () => {
    return getDocs(userRef)
        .then((shot) => shot.docs)
        .then(coll => {
            let user = []
            coll.forEach(item => {
                user.push({ ...item.data(), id: item.id })
            });
            return user
        })
        .catch(e => console.log(e.message))
}

getUsers()
.then(books=>console.log(books))