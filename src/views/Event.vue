<template>
    <div class="event-page">
        <router-view class="mt-24"></router-view>
        <teleport to="#navigation-portal-target">
            <div class="flex items-center justify-between w-full h-full">
                <div class="flex items-center gap-4">
                    <span class="text-2xl">
                        {{ event?.name }}
                    </span>
                </div>

                <div v-if="isLoggedInUsersTurn" class="flex gap-4 text-4xl text-yellow-400">
                    <IconGift></IconGift>
                    Your turn to pick a gift IconGift
                    <IconGift></IconGift>
                </div>

                <Button v-if="isAdminUser" :disabled="event?.started" @click="startEvent"> Start Event </Button>
                <div v-else></div>
            </div>
        </teleport>
    </div>
</template>

<script setup>
import Button from "@/components/shared/Button.vue"
import { computed, toRefs, watch, onMounted } from "vue"
import { useStore } from "vuex"
import { useRoute } from "vue-router"
import { firestore } from "@/firebase"
import IconGift from "~icons/fa/gift"

const props = defineProps({ eventId: String })
const route = useRoute()
const store = useStore()

const { eventId } = toRefs(props)
const event = computed(() => {
    return store.state.event
})

const isAdminUser = computed(() => {
    return store.state.user != undefined && store.state.user.uid === event.value?.createdBy
})

watch(
    event,
    (e) => {
        document.title = `${e?.name} | WEEP`
    },
    { immediate: true },
)

let unsubscribeEvent
watch(
    eventId,
    (newId, oldId) => {
        unsubscribeEvent?.()

        unsubscribeEvent = firestore
            .collection("events")
            .doc(newId)
            .onSnapshot((snapshot) => {
                const event = snapshot.data()

                store.commit("setEvent", event)
            })
    },
    { immediate: true },
)

const startEvent = async () => {
    firestore.collection("events").doc(eventId.value).update({
        started: true,
    })
}

const isLoggedInUsersTurn = computed(() => {
    return store.getters.isLoggedInUsersTurn
})
</script>
