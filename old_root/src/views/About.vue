<template>
    <div class="about-page">
        <button @click="signOut">Sign out of Google</button>
    </div>
</template>

<script>
import { auth } from "@/firebase"

export default {
    name: "About",
    setup() {
        const signOut = () => {
            auth.signOut()
        }

        return {
            signOut,
        }
    },
}
</script>