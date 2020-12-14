<template>
    <div class="grid grid-cols-5 gap-8">
        <Gift></Gift>
        <Gift unwrapped></Gift>
        <Gift unwrapped></Gift>
        <Gift unwrapped></Gift>
        <Gift unwrapped></Gift>
        <Gift></Gift>
        <Gift></Gift>
        <Gift></Gift>
        <Gift></Gift>
        <Gift></Gift>
        <Gift></Gift>
        <Gift></Gift>
        <Gift></Gift>
        <Gift not-available></Gift>
        <Gift unwrapped></Gift>
        <Gift unwrapped :stolen="1"></Gift>
        <Gift unwrapped :stolen="2"></Gift>
        <Gift></Gift>
        <Gift></Gift>
        <Gift></Gift>
        <Gift></Gift>
        <Gift></Gift>
        <Gift></Gift>
        <Gift></Gift>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import Gift from "@/components/home/Gift"

export default {
    setup () {
        const state = reactive({
            count: 0,
        })
    
        return {
            ...toRefs(state),
            Gift
        }
    }
}
</script>