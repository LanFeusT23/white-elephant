<template>
    <div>
        LANDING

        <router-link :to="EVENTSLANDING">See Events</router-link>
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

<style lang="scss" scoped>
</style>