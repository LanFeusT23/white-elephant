<template>
    <Modal>
        <div class="flex items-center justify-between h-full">
            <i :class="{ 'opacity-25': currentIndex === 0 }" 
                @click="previousGift" 
                class="p-2 text-6xl cursor-pointer fa fa-angle-left">
            </i>


            <Gift big v-bind="currentGift">
                <div class="flex justify-center mt-4">
                    <Button class="text-xl" v-if="canBeClaimed" @click="claimGift">
                        Claim this gift
                    </Button>

                    <div class="text-xl text-yellow-300" secondary v-if="currentGift.notAvailable">
                        This gift is no longer available :(
                    </div>

                    <div class="text-xl" v-if="isAlreadyUsersGift">
                        You claimed this gift!
                    </div>
                </div>
            </Gift>

            <i :class="{ 'opacity-25': currentIndex === gifts.length - 1 }" 
                @click="nextGift" 
                class="p-2 text-6xl cursor-pointer fa fa-angle-right">
            </i>
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
import { computed, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import { firestore } from '@/firebase'
import { useRoute } from 'vue-router'
export default {
    props: {
        gifts: Array,
        selectedGiftIndex: Number
    },
    emits: ["close-modal"],
    setup (props, { emit }) {
        const route = useRoute()
        const store = useStore()
        const { gifts, selectedGiftIndex } = toRefs(props)
        const currentIndex = ref(selectedGiftIndex.value)

        const currentGift = computed(() => {
            return gifts.value[currentIndex.value]
        })

        const isAlreadyUsersGift = computed(() => {
            return currentGift.value.selectedBy === store.state.user.uid
        })

        const closeModal = () => {
            emit("close-modal")
        }

        const previousGift = () => {
            if (currentIndex.value > 0) {
                currentIndex.value = currentIndex.value - 1
            }
        }

        const nextGift = () => {
            if (currentIndex.value < gifts.value.length) {
                currentIndex.value = currentIndex.value + 1
            }
        }

        const claimGift = () => {
            firestore
                .collection("events").doc(route.params.eventId) 
                .collection("gifts").doc(currentGift.value.id)
                .update({
                    selectedBy: store.state.user.uid
                })
        }

        const canBeClaimed = computed(() => {
            return !isAlreadyUsersGift.value && !currentGift.value.notAvailable && store.state.event.currentUser === store.state.user.uid
        })

        return {
            Modal,
            Button,
            Gift,
            isAlreadyUsersGift,
            closeModal,
            claimGift,
            previousGift,
            nextGift,
            gifts,
            currentGift,
            canBeClaimed,
            currentIndex
        }
    }
}
</script>

<style lang="scss" scoped>

</style>