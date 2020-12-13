<template>
    <div class="login-page">
        <button @click="loginWithGoogle">Login with Google</button>
    </div>
</template>

<script>
import { computed, watch } from "vue"
import { auth, googleAuth } from "@/firebase.js"
import { useRoute, useRouter } from "vue-router"
import store from "@/store"

import { HOME } from "@/router"

export default {
    name: "Login",
    setup() {
        const route = useRoute()
        const router = useRouter()

        const loginWithGoogle = async () => {
            await auth.signInWithPopup(googleAuth)
        }

        //we can probably watchEffect to combine this computed and watch
        const user = computed(() => store.state.user)

        watch(user, (u) => {
            if (u != null) {
                if (route.query.redirect != null) {
                    // @ts-ignore
                    router.push(route.query.redirect)
                } else {
                    router.push(HOME)
                }
            }
        })

        return {
            loginWithGoogle,
        }
    },
}
</script>

<style lang="scss" scoped>
</style>