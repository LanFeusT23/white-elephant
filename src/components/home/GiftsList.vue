<template>
    <img v-if="loading" src="@/assets/images/candy-cane-animated.gif" alt="animated candy cane" />

    <template v-else>
        <div v-if="finalGifts.length > 0" class="flex-1 gifts-list">
            <Gift v-for="gift in finalGifts" :key="gift.id" v-bind="gift" @click="openModal(gift.id)" class="transition-transform ease-in-out transform hover:z-10 hover:scale-200"> </Gift>
        </div>

        <div v-else class="flex items-center justify-center flex-1 text-4xl text-yellow-300">No gifts added yet!</div>
    </template>

    <teleport to="#modal-portal-target" v-if="isOpenModal">
        <GiftsModal @close-modal="closeModal" :selectedGift="selectedGift"></GiftsModal>
    </teleport>
</template>

<script>
import { computed, onUnmounted, ref, toRefs } from "vue"
import Gift from "@/components/home/Gift"
import GiftsModal from "@/components/home/GiftsModal"
import Button from "@/components/shared/Button"
import firebaseListChangeHelper from "@/helpers/firebaseListChangeHelper"
import { firestore } from "@/firebase"
import { useRoute } from "vue-router"
import { useStore } from "vuex"
import orderBy from "lodash/orderBy"

export default {
    name: "GiftsList",
    setup() {
        const route = useRoute()
        const store = useStore()
        const selectedGiftId = ref()
        const loading = ref(true)
        const selectedGift = computed(() => {
            return finalGifts.value.find((x) => x.id === selectedGiftId.value)
        })

        const openModal = (giftId) => {
            selectedGiftId.value = giftId
        }

        const closeModal = () => {
            selectedGiftId.value = undefined
        }

        const isOpenModal = computed(() => {
            return selectedGiftId.value != null
        })

        const eventRef = firestore.collection("events").doc(route.params.eventId)
        const giftsRef = eventRef.collection("gifts")
        const usersRef = eventRef.collection("users")

        const unWrappedGiftsList = ref([])
        const unsubscribeGifts = giftsRef.where("revealed", "==", true).onSnapshot((snapshot) => {
            loading.value = false
            snapshot.docChanges().forEach((change) => {
                firebaseListChangeHelper(change, unWrappedGiftsList)
            })
        })

        const wrappedGiftsList = ref([])
        const unsubscribeUsers = usersRef.orderBy("displayName").onSnapshot((snapshot) => {
            loading.value = false
            snapshot.docChanges().forEach((change) => {
                firebaseListChangeHelper(change, wrappedGiftsList)
            })
        })

        const event = computed(() => {
            return store.state.event
        })

        const finalGifts = computed(() => {
            const unWrappedGifts = unWrappedGiftsList.value
            const wrappedGifts = wrappedGiftsList.value

            const giftCards = wrappedGifts.map((wrappedGift) => {
                // users and gifts share the same id from the user's uid
                const unwrappedGift = unWrappedGifts.find((x) => x.id === wrappedGift.id)
                const selectedByUser = wrappedGifts.find((x) => x.id === unwrappedGift?.selectedBy)

                let newGift = {
                    ...wrappedGift,
                    selectedByName: "Not Selected",
                    notAvailable: false,
                    giftUrl: wrappedGift?.wrappedGiftUrl,
                    selectedBy: undefined,
                    isClaimed: false,
                    stolenCount: 0,
                }

                if (unwrappedGift) {
                    newGift = {
                        ...unwrappedGift,
                        ...wrappedGift,
                        selectedBy: unwrappedGift.selectedBy,
                        giftUrl: unwrappedGift.unwrappedGiftUrl,
                        selectedByName: selectedByUser?.displayName,
                        notAvailable: event.value.maxSteals <= unwrappedGift.stolenCount,
                        isClaimed: true,
                    }
                }

                return newGift
            })

            return orderBy(giftCards, "id", "desc")
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
            selectedGift,
            loading,
        }
    },
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