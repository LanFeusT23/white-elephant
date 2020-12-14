<template>
    <div class="flex items-center justify-between h-24 px-8 shadow-xl bg-red-1000">
        <div class="flex items-center gap-4">
            <img src="../../assets/images/logo.png" alt="Logo">
            <span class="text-2xl">
                Corp Apps 2020 White Elephant
            </span>
        </div>

        <div class="flex gap-4 text-4xl text-yellow-400">
            <i class="fa fa-gift" />Your turn to pick a gift<i class="fa fa-gift" />
        </div>

        <div class="flex items-center gap-4">

            <Button>
                Start Event
            </Button>

            <div class="text-xl">
                {{ user?.displayName }}
            </div>
        </div>

    </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from "vuex"
import Button from "@/components/shared/Button"

export default {
    setup () {
        const store = useStore()

        const user = computed(() => store.state.user);

        return {
            user,
            Button
        }
    }
}
</script>

<style lang="scss" scoped>

</style>