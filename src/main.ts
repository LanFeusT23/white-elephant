import { createApp } from "vue"
import { createPinia } from "pinia"
import localforage from "localforage"

import App from "./App.vue"
import router from "./router"

// import { auth } from "./firebase"

import "./assets/styles.scss"

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount("#app")

// localforage.config({
//     name: "white-elephant",
//     storeName: "white-elephant-store",
// })

// const user = await localforage.getItem("user")

// store.commit("setUser", user)

// let initialized = false

// auth.onAuthStateChanged((user) => {
//     if (user) {
//         const userObject = {
//             uid: user.uid,
//             email: user.email,
//             displayName: user.displayName,
//         }
//         localforage.setItem("user", userObject)
//         store.commit("setUser", userObject)
//     } else {
//         store.commit("setUser", null)
//         localforage.setItem("user", null)

//         if (initialized) {
//             router.push(LANDING)
//         }
//     }

//     initialized = true
// })
