<template>
    <Navigation class="flex items-center justify-between h-24 px-8 shadow-xl bg-red-1000"></Navigation>
    <router-view class="flex-1" />
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