<template>
    <div class="about-page">
        <button @click="signOut">Sign out of Google</button>
    </div>
</template>

<script setup>
import { auth } from "@/firebase"

const signOut = () => {
    auth.signOut()
}
</script>
