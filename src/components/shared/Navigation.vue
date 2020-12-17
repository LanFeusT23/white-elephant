<template>
    <div class="flex items-center justify-between h-24 gap-8 px-8 shadow-xl bg-opacity-90 bg-red-1000">
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

<script>
import { computed, ref, watch, onMounted } from "vue"
import { useStore } from "vuex"
import { auth } from "@/firebase"

import { gsap } from "gsap"
import { Physics2DPlugin } from "gsap/Physics2DPlugin"

gsap.registerPlugin(Physics2DPlugin)

export default {
    setup() {
        const store = useStore()
        const signOut = () => {
            auth.signOut()
        }

        const user = computed(() => store.state.user)

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

        return {
            user,
            signOut,
            hovered,
            snowflake,
        }
    },
}
</script>