<template>
    <Navigation class="flex items-center justify-between h-24 px-8 shadow-xl"></Navigation>
    <router-view class="container flex-1 mx-auto" />
    <div id="modal-portal-target"></div>
</template>

<script>
import { onMounted } from "vue"
import Navigation from "@/components/shared/Navigation"

export default {
    setup() {
        onMounted(() => {
            document.title = "WEEP"
        })

        return {
            Navigation,
        }
    },
}
</script>