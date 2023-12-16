import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"
import "firebase/storage"
import "firebase/performance"
// @ts-ignore
import firebaseSettings from "../firebase.json"

export const projectId = "white-elephant-capps"

import store from "@/store"

const firebaseConfig = {
    apiKey: "AIzaSyCFBIaVxyPG83A7ljgFocElHpFBMkEWhM0",
    authDomain: "white-elephant-capps.firebaseapp.com",
    projectId,
    storageBucket: "white-elephant-capps.appspot.com",
    messagingSenderId: "665520767358",
    appId: "1:665520767358:web:6da4eb0ff59e86745fb32f",
    measurementId: "G-RGQHLP6N55",
}

const app = firebase.initializeApp(firebaseConfig)
firebase.performance()

export const firestore = firebase.firestore()

export const auth = firebase.auth()
export const storage = firebase.storage().ref()

export const googleAuth = new firebase.auth.GoogleAuthProvider()
export const sessionPersistence = firebase.auth.Auth.Persistence.SESSION

export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp
console.log("asdasD", import.meta.env.VITE_APP_EMULATE)
if (import.meta.env.VITE_APP_EMULATE) {
    console.log("emulating")
    firestore.settings({
        host: `localhost:${firebaseSettings.emulators.firestore.port}`,
        ssl: false,
    })

    firebase.auth().useEmulator(`http://localhost:${firebaseSettings.emulators.auth.port}/`)

    // @ts-ignore

    window.bootstrap = async () => {
        const userId = store.state?.user?.uid
    }
}
