<template>
    <div class="p-8 pt-5 bg-gray-900 w-72 bg-opacity-90 rounded-xl">
        <div class="flex justify-center mb-4" v-if="!event?.started">
            <Button @click="goToUpload">
                {{ uploadText }}
            </Button>
        </div>

        <ol class="pl-10" :class="{ 'list-decimal': event?.started }">
            <li v-for="user in users" :key="user.id" class="relative text-xl" :class="{ 'text-yellow-400': isActive(user.id), 'opacity-50': user.selectedGift && !isActive(user.id) }">
                <IconGift v-if="isActive(user.id)" class="absolute -left-14"></IconGift>
                {{ user.displayName }}
            </li>
        </ol>
    </div>
</template>

<script setup>
import Button from "@/components/shared/Button.vue"
import { computed, ref, onUnmounted } from "vue"
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import { firestore } from "@/firebase"
import { UPLOAD } from "@/router"
import orderBy from "lodash/orderBy"
import firebaseListChangeHelper from "@/helpers/firebaseListChangeHelper"
import IconGift from "~icons/fa/gift"

const route = useRoute()
const router = useRouter()
const store = useStore()
const { uid } = store.state.user

const event = ref()
const unsubscribeEvent = firestore
    .collection("events")
    .doc(route.params.eventId)
    .onSnapshot((doc) => {
        event.value = {
            id: doc.id,
            ...doc.data(),
        }
    })

const users = ref([])
const unsubscribeUsers = firestore
    .collection("events")
    .doc(route.params.eventId)
    .collection("users")
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            firebaseListChangeHelper(change, users)
        })
    })

const orderedUsers = computed(() => {
    return orderBy(users.value, "order")
})

onUnmounted(() => {
    unsubscribeUsers()
    unsubscribeEvent()
})

const hasJoined = computed(() => {
    return users.value.some((x) => x.id === uid)
})

const uploadText = computed(() => {
    return hasJoined.value ? "Edit Gift" : "Join Event"
})

const goToUpload = () => {
    router.push(UPLOAD)
}

const isActive = (userId) => {
    return event.value?.currentPlayer === userId
}
</script>
