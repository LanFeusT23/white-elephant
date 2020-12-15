<template>
    <div>
        LANDING

        <router-link :to="EVENTCREATE">Create an event</router-link>

        <router-link v-for="event in events" :key="event.id" :to="{ ...HOME, params: { eventId: event.id } }">{{ event.name }}</router-link>
    </div>
</template>

<script>
import { firestore } from "@/firebase"
import { EVENTCREATE, HOME } from "@/router"
import { ref, onUnmounted } from "vue"
export default {
    setup() {
        const events = ref([])

        const unsubscribeEvents = firestore.collection("events").onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const { newIndex, oldIndex, doc, type } = change
                if (type === "added") {
                    events.value.splice(newIndex, 0, {
                        id: doc.id,
                        ...doc.data(),
                    })
                } else if (type === "modified") {
                    events.value.splice(oldIndex, 1)
                    events.value.splice(newIndex, 0, {
                        id: doc.id,
                        ...doc.data(),
                    })
                } else if (type === "removed") {
                    events.value.splice(oldIndex, 1)
                }
            })
        })

        onUnmounted(() => {
            unsubscribeEvents()
        })

        return { EVENTCREATE, HOME, events }
    },
}
</script>

<style lang="scss" scoped>
</style>