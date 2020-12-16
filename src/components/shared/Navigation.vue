<template>
    <div class="flex items-center justify-between h-24 gap-8 px-8 shadow-xl bg-opacity-90 bg-red-1000">
        <router-link to="/">
            <img class="h-20" src="@/assets/images/white-elephant.png" alt="Logo" />
        </router-link>

        <div id="navigation-portal-target" class="flex-1 h-full"></div>

        <div class="flex items-center gap-4">
            <div class="flex items-center gap-4">
                <span class="text-xl">{{ user?.displayName }}</span>
                <span class="hidden2">{{ user?.uid }}</span>

                <span class="text-sm cursor-pointer" v-if="user" @click="signOut">Log Out</span>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from "vue"
import { useStore } from "vuex"
import { auth } from "@/firebase"

export default {
    setup() {
        const store = useStore()
        const signOut = () => {
            auth.signOut()
        }

        const user = computed(() => store.state.user)

        return {
            user,
            signOut,
        }
    },
}
</script>