<template>
    <div class="flex gap-7 home">
        <UserSelectedGift></UserSelectedGift>

        <GiftsList></GiftsList>

        <UserEventList></UserEventList>
    </div>
</template>

<script setup>
import UserSelectedGift from "@/components/home/UserSelectedGift.vue"
import GiftsList from "@/components/home/GiftsList.vue"
import UserEventList from "@/components/home/UserEventList.vue"
</script>
