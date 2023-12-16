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
                            {{ claimText }}
                        </Button>

                        <div class="text-xl text-yellow-300" secondary v-if="selectedGift.notAvailable && !isAlreadyUsersGift">This gift is no longer available :(</div>

                        <div class="text-xl" v-if="isAlreadyUsersGift">You claimed this gift!</div>
                    </div>
                </template>
            </Gift>
        </div>

        <div class="absolute cursor-pointer top-4 right-6" @click="closeModal">
            <i class="fa fa-times"></i>
        </div>
    </Modal>
</template>

<script setup>
import Gift from "@/components/home/Gift.vue"
import Modal from "@/components/shared/Modal.vue"
import Button from "@/components/shared/Button.vue"
import { computed, ref, toRefs, watch } from "vue"
import { useStore } from "vuex"
import { firestore, serverTimestamp } from "@/firebase"
import { useRoute } from "vue-router"

const props = defineProps({ selectedGift: Object })
const emit = defineEmits(["close-modal"])

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

    const myPreviouslySelectedGifts = await giftsRef.where("selectedBy", "==", store.state.user.uid).get()
    myPreviouslySelectedGifts.forEach((element) => {
        // should only be one...
        if (element.exists) {
            giftsRef.doc(element.id).update({
                selectedBy: null,
            })
        }
    })

    let giftDoc = await firestore.collection("events").doc(route.params.eventId).collection("gifts").doc(selectedGift.value.id).update({
        // updatedTimeStamp: serverTimestamp(),
        selectedBy: store.state.user.uid,
        revealed: true,
    })

    closeModal()
}

const isLoggedInUsersTurn = computed(() => {
    return store.getters.isLoggedInUsersTurn
})

const canBeClaimed = computed(() => {
    return !isAlreadyUsersGift.value && !selectedGift.value.notAvailable && isLoggedInUsersTurn.value
})

const claimText = computed(() => {
    return selectedGift.value.selectedBy == null ? "Claim this gift" : "Steal this gift"
})
</script>
