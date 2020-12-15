<template>
    <Modal>
        <div class="flex items-center justify-between h-full">
            <i :class="{ 'opacity-25': selectedGiftIndex === 0 }" 
                @click="previousGift" 
                class="p-2 text-6xl cursor-pointer fa fa-angle-left">
            </i>
            
            <Gift big v-bind="currentGift">
                <template #header>
                    <div class="mb-2 text-2xl">
                        {{ currentGift.description }}
                    </div>
                </template>

                <template #footer>
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
                </template>
            </Gift>

            <i :class="{ 'opacity-25': selectedGiftIndex === gifts.length - 1 }" 
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
import { computed, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { firestore } from '@/firebase'
import { useRoute } from 'vue-router'
export default {
    props: {
        gifts: Array,
        selectedGiftIndex: Number
    },
    emits: ["close-modal", "update:selectedGiftIndex"],
    setup (props, { emit }) {
        const route = useRoute()
        const store = useStore()
        const { gifts, selectedGiftIndex } = toRefs(props)

        const currentGift = computed(() => {
            return gifts.value[selectedGiftIndex.value]
        })

        const isAlreadyUsersGift = computed(() => {
            console.log("selectedBy", currentGift.value);
            return currentGift.value.selectedBy === store.state.user.uid
        })

        const closeModal = () => {
            emit("close-modal")
        }

        const previousGift = () => {
            if (selectedGiftIndex.value > 0) {
                emit("update:selectedGiftIndex", selectedGiftIndex.value - 1)
                // selectedGiftIndex.value = selectedGiftIndex.value - 1
            }
        }

        const nextGift = () => {
            if (selectedGiftIndex.value < gifts.value.length) {
                emit("update:selectedGiftIndex", selectedGiftIndex.value + 1)
                // selectedGiftIndex.value = selectedGiftIndex.value + 1
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
            return !isAlreadyUsersGift.value && !currentGift.value.notAvailable && store.getters.isLoggedInUsersTurn
        })

        watch(currentGift, () => {
            console.log(currentGift.value);
        }, { immediate: true })

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
            selectedGiftIndex
        }
    }
}
</script>

<style lang="scss" scoped>

</style>