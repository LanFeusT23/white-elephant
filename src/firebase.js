import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"
import "firebase/storage"
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
    measurementId: "G-RGQHLP6N55"
}

const app = firebase.initializeApp(firebaseConfig)
export const firestore = firebase.firestore()

export const auth = firebase.auth()
export const storage = firebase.storage().ref()

export const googleAuth = new firebase.auth.GoogleAuthProvider()
export const sessionPersistence = firebase.auth.Auth.Persistence.SESSION

export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp

if (process.env.VUE_APP_EMULATE) {
    console.log("emulating")
    firestore.settings({
        host: `localhost:${firebaseSettings.emulators.firestore.port}`,
        ssl: false
    })

    firebase.auth().useEmulator(`http://localhost:${firebaseSettings.emulators.auth.port}/`)

    // @ts-ignore
    window.bootstrap = async () => {
        const userId = store.state?.user?.uid

        const eventRef = await firestore.collection("events").add({
            name: "CAPPS WHITE ELEPHANT 2020",
            createdBy: userId,
            currentPlayer: null,
            maxSteals: 3,
            gameStarted: false
        })

        eventRef
            .collection("users")
            .doc(userId)
            .set({
                imageUrl: "null",
                order: null,
                readyToPlay: false,
                selectedGift: false
            })

        eventRef
            .collection("gifts")
            .doc(userId)
            .set({
                imageUrl: null,
                description: "a toy"
            })

        eventRef
            .collection("users")
            .doc("user-a")
            .set({
                imageUrl: "null",
                order: null,
                readyToPlay: false,
                selectedGift: false
            })

        eventRef
            .collection("gifts")
            .doc("user-a")
            .set({
                imageUrl: null,
                description: "a toy"
            })

        eventRef
            .collection("users")
            .doc("user-b")
            .set({
                imageUrl: "null",
                order: null,
                readyToPlay: false,
                selectedGift: false
            })

        eventRef
            .collection("gifts")
            .doc("user-b")
            .set({
                imageUrl: null,
                description: "a toy"
            })
    }
}
