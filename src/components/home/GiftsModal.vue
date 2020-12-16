<template>
    <Modal @click="closeModal">
        <div class="flex items-center justify-center h-full" @click.prevent.stop>            
            <Gift big v-bind="selectedGift">
                <template #header>
                    <div class="mb-2 text-2xl">
                        {{ selectedGift.description }}
                    </div>
                </template>

                <template #footer>
                    <div class="flex justify-center mt-4">
                        <Button class="text-xl" v-if="canBeClaimed" @click="claimGift">
                            Claim this gift
                        </Button>

                        <div class="text-xl text-yellow-300" secondary v-if="selectedGift.notAvailable">
                            This gift is no longer available :(
                        </div>

                        <div class="text-xl" v-if="isAlreadyUsersGift">
                            You claimed this gift!
                        </div>
                    </div>
                </template>
            </Gift>
        </div>
        
        <div class="absolute cursor-pointer top-4 right-6" @click="closeModal">
            <i class="fa fa-times"></i>
        </div>
    </Modal>
</template>

<script>
import Gift from "@/components/home/Gift"
import Modal from "@/components/shared/Modal"
import Button from "@/components/shared/Button"
import { computed, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { firestore, serverTimestamp } from '@/firebase'
import { useRoute } from 'vue-router'
export default {
    props: {
        selectedGift: Object
    },
    emits: ["close-modal"],
    setup (props, { emit }) {
        const route = useRoute()
        const store = useStore()
        const { selectedGift } = toRefs(props)

       const isAlreadyUsersGift = computed(() => {
            return selectedGift.value.selectedBy === store.state.user.uid
        })

        const closeModal = () => {
            emit("close-modal")
        }

        const claimGift = async () => {
            // reset my previously claimed gift 
            const eventRef = firestore.collection("events").doc(route.params.eventId)
            const giftsRef = eventRef.collection("gifts")

            const myPreviouslySelectedGifts = (await giftsRef.where("selectedBy", "==", store.state.user.uid).get())
            myPreviouslySelectedGifts.forEach(element => {
                // should only be one...
                if (element.exists) {
                    giftsRef.doc(element.id).update({
                        selectedBy: null
                    })
                }
            });

            let giftDoc = firestore
                .collection("events").doc(route.params.eventId) 
                .collection("gifts").doc(selectedGift.value.id)
                    .update({
                        // updatedTimeStamp: serverTimestamp(),
                        selectedBy: store.state.user.uid,
                        revealed: true
                    })
        }

        const isLoggedInUsersTurn = computed(() => {
            return store.getters.isLoggedInUsersTurn
        })

        const canBeClaimed = computed(() => {
            return !isAlreadyUsersGift.value && !selectedGift.value.notAvailable && isLoggedInUsersTurn.value
        })

        return {
            Modal,
            Button,
            Gift,
            isAlreadyUsersGift,
            isLoggedInUsersTurn,
            closeModal,
            claimGift,
            selectedGift,
            canBeClaimed
        }
    }
}
</script>