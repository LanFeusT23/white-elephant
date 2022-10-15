import firebase from "@firebase/app"
import { initializeFirestore, getFirestore } from "@firebase/firestore"
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "@firebase/auth"
import { getStorage } from "@firebase/storage"

import { getPerformance } from "@firebase/performance"

// @ts-ignore
import firebaseSettings from "../firebase.json"

export const projectId = "white-elephant-capps"

import { useFirebaseStore } from "@/stores/firebaseStore"

const { user } = useFirebaseStore()

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
getPerformance(app)

const db = getFirestore(app)

export const auth = getAuth()
export const storage = getStorage(app) //.ref()

export const googleAuth = new GoogleAuthProvider()

if (process.env.VUE_APP_EMULATE) {
    console.log("emulating")

    initializeFirestore(app, {
        host: `localhost:${firebaseSettings.emulators.firestore.port}`,
        ssl: false,
    })

    connectAuthEmulator(auth, `http://localhost:${firebaseSettings.emulators.auth.port}/`)

    // @ts-ignore

    window.bootstrap = async () => {
        const userId = user.value?.uid
    }
}
