<template>
    <Navigation class="flex items-center justify-between h-24 px-8 shadow-xl"></Navigation>
    <router-view class="container flex-1 mx-auto" />
    <div id="modal-portal-target"></div>
</template>

<script setup>
import { onMounted } from "vue"
import Navigation from "@/components/shared/Navigation.vue"

onMounted(() => {
    document.title = "WEEP"
})
</script>
