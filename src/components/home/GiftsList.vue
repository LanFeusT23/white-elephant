<template>
    <div v-if="finalGifts.length >= 0" class="flex-1 gifts-list">
        <Gift v-for="(gift, index) in finalGifts"
            :key="gift.id"
            v-bind="gift"
            @click="openModal(index)">
        </Gift>
    </div>

    <div v-else class="flex items-center justify-center flex-1 text-4xl text-yellow-300" >
        No gifts added yet!
    </div>

    <!-- {{ finalGifts.map(x=>x.selectedByName) }} -->

    <teleport to="#modal-portal-target" v-if="isOpenModal">
        <GiftsModal 
            @close-modal="closeModal"
            :gifts="finalGifts"
            :selectedGiftIndex="selectedGiftIndex">
        </GiftsModal>
    </teleport>
</template>

<script>
import { computed, onUnmounted, ref, toRefs } from 'vue'
import Gift from "@/components/home/Gift"
import GiftsModal from "@/components/home/GiftsModal"
import Button from "@/components/shared/Button"
import firebaseListChangeHelper from "@/helpers/firebaseListChangeHelper"
import { firestore } from '@/firebase'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
    setup () {
        const route = useRoute()
        const store = useStore()
        const isOpenModal = ref(false)
        const selectedGiftIndex = ref();

        const openModal = (giftIndex) => {
            selectedGiftIndex.value = giftIndex
            isOpenModal.value = true
        }

        const closeModal = () => {
            selectedGiftIndex.value = undefined
            isOpenModal.value = false
        }

        const eventRef = firestore.collection("events").doc(route.params.eventId) 
        const giftsRef = eventRef.collection("gifts")
        const usersRef = eventRef.collection("users")

        
        const giftsList = ref([])
        const unsubscribeGifts = giftsRef
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach((change) => {
                    firebaseListChangeHelper(change, giftsList)
                })
        })

        const userList = ref([])
        const unsubscribeUsers = usersRef//.where("selectedBy", "!=", null)
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach((change) => {
                    firebaseListChangeHelper(change, userList)
                })
        })

        const event = computed(() => {
            return store.state.event
        })
        const finalGifts = computed(() => {
            return giftsList.value.map(gift => {
                // users and gifts share the same id from the user's uid
                const userGift = userList.value.find(x => x.id === gift.id)
                const userSelectedBy = userList.value.find(x => x.id === gift.selectedBy)

                if (userGift) {
                    console.log(userSelectedBy?.displayName);
                    gift = {
                        ...gift,
                        ...userGift,
                        selectedByName: userSelectedBy?.displayName,
                        notAvailable: event.maxSteals <= gift.stolenCount
                    }

                }

                return gift
            });
        })
        
        onUnmounted(() => {
            unsubscribeGifts()
            unsubscribeUsers()
        })

        return {
            Gift,
            GiftsModal,
            Button,
            isOpenModal,
            openModal,
            closeModal,
            finalGifts,
            selectedGiftIndex
        }
    }
}
</script>

<style lang="scss" scoped>
.gifts-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, 128px);
    gap: 2rem;
    align-content: start;
}
</style>