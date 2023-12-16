<template>
    <div class="mt-24">
        <router-link :to="EVENTCREATE" class="block text-4xl hover:text-yellow-300"> Create an event </router-link>

        <img v-if="loading" src="@/assets/images/candy-cane-animated.gif" alt="animated candy cane" />

        <router-link class="block hover:text-yellow-300" v-for="event in events" :key="event.id" :to="{ ...HOME, params: { eventId: event.id } }">
            {{ event.name }}
        </router-link>
    </div>
</template>

<script>
import { firestore } from "@/firebase"
import { EVENTCREATE, HOME } from "@/router"
import { ref, onUnmounted, onMounted } from "vue"
export default {
    setup() {
        const loading = ref(true)
        const events = ref([])

        const unsubscribeEvents = firestore.collection("events").onSnapshot((snapshot) => {
            loading.value = false
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

        onMounted(() => {
            document.title = "Event Landing | WEEP"
        })

        onUnmounted(() => {
            unsubscribeEvents()
        })

        return {
            EVENTCREATE,
            HOME,
            events,
            loading,
        }
    },
}
</script>

<style lang="scss" scoped></style>
