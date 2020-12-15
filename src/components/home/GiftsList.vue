<template>
    <div class="flex-1 gifts-list">
        <Gift v-for="gift in finalGifts" :key="gift.id" v-bind="gift"></Gift>

        <div v-if="finalGifts.length === 0" class="flex items-center justify-center w-full h-full text-4xl text-yellow-300" >
            No gifts added yet!
        </div>
    </div>

    <teleport to="#modal-portal-target" v-if="isOpenModal">
        <Modal>
            <div class="flex items-center justify-between h-full">
                <i class="p-2 text-6xl cursor-pointer fa fa-angle-left"></i>

                Gift

                <i class="p-2 text-6xl cursor-pointer fa fa-angle-right"></i>
            </div>

            <div>
                <Button>Claim this gift</Button>
            </div>

            <div class="absolute cursor-pointer top-4 right-6" @click="closeModal">
                <i class="fa fa-times"></i>
            </div>
        </Modal>
    </teleport>
</template>

<script>
import { computed, onUnmounted, ref, toRefs } from 'vue'
import Gift from "@/components/home/Gift"
import Modal from "@/components/shared/Modal"
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

        const openModal = () => {
            isOpenModal.value = true
        }

        const closeModal = () => {
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
                var userGift = userList.value.find(x => x.id === gift.id)

                if (userGift) {
                    gift = {
                        ...gift,
                        ...userGift,
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
            Modal,
            Button,
            isOpenModal,
            openModal,
            closeModal,
            finalGifts
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