<template>
    <div class="flex flex-col items-center justify-center gap-4 p-8 w-96 bg-red-1000 bg-opacity-90 rounded-xl">
        
        <template v-if="claimedGift">
            <img class="object-cover w-full rounded-xl filter-shadow" :src="claimedGift.unwrappedGiftUrl" :alt="claimedGift.description" :title="claimedGift.description">
            
            <div class="text-4xl">
                Your claimed gift!
            </div>
        </template>

        <template v-else>
            <img src="../../assets/images/sad-santa.png" alt="Sad Santa">
            <div class="text-4xl">
                No gifts selected yet!
            </div>
        </template>
    </div>
</template>

<script>
import { firestore } from '@/firebase'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { onUnmounted, ref } from 'vue'
export default {
    setup () {
        const route = useRoute()
        const store = useStore()

        const claimedGift = ref();

        const eventRef = firestore.collection("events").doc(route.params.eventId)
        const giftsRef = eventRef.collection("gifts")
        const unsubscribeGifts = giftsRef
            .where("selectedBy", "==", store.state.user.uid)
            .limit(1)
            .onSnapshot((snapshot) => {
               claimedGift.value = snapshot.docs[0]?.data()
        }   )

        onUnmounted(() => {
            unsubscribeGifts()
        })

        return {
            claimedGift
        }
    }
}
</script>