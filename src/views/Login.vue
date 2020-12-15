<template>
    <div class="grid login-page place-items-center">
        <div class="mt-8 cursor-pointer login-page__google" @click="loginWithGoogle"></div>
    </div>
</template>

<script>
import { computed, watch } from "vue"
import { auth, googleAuth } from "@/firebase.js"
import { useRoute, useRouter } from "vue-router"
import store from "@/store"

import { LANDING } from "@/router"

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
                    router.push(route.query.redirect)
                } else {
                    router.push(LANDING)
                }
            }
        })

        return {
            loginWithGoogle
        }
    }
}
</script>

<style lang="scss" scoped>
    .login-page {
        &__google {
            background: url("../assets/images/btn_google_signin_light_normal_web@2x.png") center center no-repeat;
            width: 382px;
            height: 92px;

            &:hover {
                background-image: url("../assets/images/btn_google_signin_light_focus_web@2x.png");
            }

            &:active {
                background-image: url("../assets/images/btn_google_signin_light_pressed_web@2x.png");
            }
        }
    }
</style>