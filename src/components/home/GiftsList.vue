<template>
    <div v-if="finalGifts.length >= 0" class="flex-1 gifts-list">
        <Gift 
            v-for="gift in finalGifts"
            :key="gift.id" 
            v-bind="gift"
            @click="openModal(gift.id)"
            class="transition-transform ease-in-out transform hover:z-10 hover:scale-200">
        </Gift>
    </div>

    <div v-else class="flex items-center justify-center flex-1 text-4xl text-yellow-300">No gifts added yet!</div>

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
    setup() {
        const route = useRoute()
        const store = useStore()
        const selectedGift = ref()

        const openModal = (giftId) => {
            selectedGift.value = finalGifts.value.find(x => x.id === giftId)
        }

        const closeModal = () => {
            selectedGift.value = undefined
        }

        const isOpenModal = computed(() => {
            return selectedGift.value != null
        })

        const eventRef = firestore.collection("events").doc(route.params.eventId)
        const giftsRef = eventRef.collection("gifts")
        const usersRef = eventRef.collection("users")

        const giftsList = ref([])
        const unsubscribeGifts = giftsRef.where("selectedBy", "!=", null).onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                firebaseListChangeHelper(change, giftsList)
            })
        })

        const userList = ref([])
        const unsubscribeUsers = usersRef.orderBy("displayName").onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                firebaseListChangeHelper(change, userList)
            })
        })

        const event = computed(() => {
            return store.state.event
        })

        const finalGifts = computed(() => {
            const gl = giftsList.value
            const ul = userList.value

            const giftCards = ul.map((gift) => {
                // users and gifts share the same id from the user's uid
                const unwrappedGift = gl.find((x) => x.selectedBy === gift.id)
                const selectedByUser = ul.find((x) => x.id === unwrappedGift?.selectedBy)

                gift = {
                    ...gift,
                    selectedByName: "Not Selected",
                    notAvailable: false,
                    giftUrl: gift?.wrappedGiftUrl,
                    selectedBy: undefined,
                    isClaimed: false,
                }

                if (unwrappedGift) {
                    gift = {
                        ...unwrappedGift,
                        ...gift,
                        selectedBy: unwrappedGift.selectedBy,
                        giftUrl: unwrappedGift.unwrappedGiftUrl,
                        selectedByName: selectedByUser?.displayName,
                        notAvailable: event.maxSteals <= gift.stolenCount,
                        isClaimed: true,
                    }
                }

                return gift
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
            selectedGift
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