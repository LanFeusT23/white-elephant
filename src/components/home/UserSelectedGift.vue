<template>
    <div class="flex flex-col items-center justify-center gap-4 p-8 bg-gray-900 w-96 bg-opacity-90 rounded-xl">
        <template v-if="claimedGift">
            <div class="self-start text-lg">
                {{ claimedGift.description }}
            </div>

            <img class="object-cover w-full rounded-xl filter-shadow" :src="claimedGift.unwrappedGiftUrl" :alt="claimedGift.description" :title="claimedGift.description" />

            <div class="text-4xl">Your selected gift!</div>
        </template>

        <template v-else>
            <img src="../../assets/images/sad-santa.png" alt="Sad Santa" />
            <div class="text-4xl">You have no gifts!</div>
        </template>
    </div>
</template>

<script setup>
import { firestore } from "@/firebase"
import { useRoute } from "vue-router"
import { useStore } from "vuex"
import { onUnmounted, ref } from "vue"
const route = useRoute()
const store = useStore()

const claimedGift = ref()

const eventRef = firestore.collection("events").doc(route.params.eventId)
const giftsRef = eventRef.collection("gifts")
const unsubscribeGifts = giftsRef
    .where("selectedBy", "==", store.state.user.uid)
    .limit(1)
    .onSnapshot((snapshot) => {
        claimedGift.value = snapshot.docs[0]?.data()
    })

onUnmounted(() => {
    unsubscribeGifts()
})
</script>
