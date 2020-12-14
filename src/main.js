import { createApp } from "vue"
import localforage from "localforage"
import App from "./App.vue"
import router, { HOME } from "./router"
import store from "./store"
import "./assets/styles.scss"
import { auth } from "./firebase"
;(async () => {
    localforage.config({
        name: "white-elephant",
        storeName: "white-elephant-store"
    })

    const user = await localforage.getItem("user")

    store.commit("setUser", user)

    auth.onAuthStateChanged(user => {
        if (user) {
            const userObject = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName
            }
            localforage.setItem("user", userObject)
            store.commit("setUser", userObject)
        } else {
            store.commit("setUser", null)
            localforage.setItem("user", null)
            router.push(HOME)
        }
    })

    createApp(App)
        .use(store)
        .use(router)
        .mount("#app")
})()
