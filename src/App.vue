<template>
    <Navigation class="flex items-center justify-between h-24 px-8 shadow-xl bg-red-1000"></Navigation>
    <router-view class="container flex-1 mx-auto" />
    <div id="modal-portal-target"></div>
</template>

<script>
    import Navigation from "@/components/shared/Navigation"

    export default {
        setup () {
            return {
                Navigation
            }
        }
    }
</script>