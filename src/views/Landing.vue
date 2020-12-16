<template>
    <div class="container flex flex-col items-center gap-12 align-middle justify-items-center">
        <h1 class="text-5xl text-yellow-300">Welcome to (NAME OF THE WEBSITE)!!</h1>

        <img class="object-scale-down h-96" src="@/assets/images/white-elephant.png" alt="Logo" />

        <router-link class="text-3xl hover:text-yellow-300" :to="EVENTSLANDING">See Upcoming Events</router-link>

        <teleport to="#navigation-portal-target">
            <div class="flex items-center justify-between w-full h-full">
                <div class="flex items-center gap-4">
                    <span class="text-5xl"> NAME OF THE WEBSITE </span>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script>
import { EVENTSLANDING } from "@/router"
export default {
    setup() {
        return {
            EVENTSLANDING,
        }
    },
}
</script>