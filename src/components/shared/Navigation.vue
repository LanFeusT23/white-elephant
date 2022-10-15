<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
// import { auth } from "@/firebase"

import { gsap } from "gsap"
import { Physics2DPlugin } from "gsap/Physics2DPlugin"
import { useFirebaseStore } from "@/stores/firebaseStore"

gsap.registerPlugin(Physics2DPlugin)

// const { user } = useFirebaseStore()
// const signOut = () => {
//     auth.signOut()
// }

const hovered = ref(false)
const snowflake = ref(null)

const tl = gsap.timeline()
tl.pause()

onMounted(() => {
    tl.set(snowflake.value, {
        x: -6,
    })

    tl.to(snowflake.value, {
        opacity: 1,
        duration: 0.25,
    })

    tl.to(
        snowflake.value,
        {
            duration: 5,
            physics2D: {
                velocity: 100,
                angle: -101,
                gravity: 500,
            },
        },
        "-=.25"
    )

    tl.to(snowflake.value, {
        duration: 5,
        opacity: 0,
    })
})

watch(hovered, (h) => {
    if (h) {
        tl.restart()
    } else {
        tl.restart().pause()
    }
})
</script>
<template>
    <div class="flex items-center justify-between h-24 gap-8 px-8 bg-gray-900 shadow-xl bg-opacity-90">
        <div ref="snowflake" class="absolute opacity-0">❄️</div>

        <router-link @mouseenter="hovered = true" @mouseleave="hovered = false" to="/">
            <img class="h-20" src="@/assets/images/white-elephant.png" alt="Logo" />
        </router-link>

        <div id="navigation-portal-target" class="flex-1 h-full"></div>

        <div class="flex items-center gap-4">
            <div class="flex items-center gap-4">
                <span class="text-xl">{{ user?.displayName }}</span>
                <span class="hidden">{{ user?.uid }}</span>

                <span class="text-sm cursor-pointer" v-if="user" @click="signOut">Log Out</span>
            </div>
        </div>
    </div>
</template>
