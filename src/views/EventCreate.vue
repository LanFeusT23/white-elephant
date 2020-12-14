<template>
    <div class="flex flex-col event-create-page justify-items-center">
        <div>
            <label for="event-name">Event name</label>
            <input id="event-name" type="text" class="text-black" />
        </div>
        <Button @click="createEvent"> Create Event </Button>
    </div>
</template>

    
<script>
import { useStore } from "vuex"
import Button from "@/components/shared/Button"
import { useRouter } from "vue-router"
import { HOME } from "@/router"
import { ref } from "vue"
import { firestore } from "@/firebase"

export default {
    setup() {
        const router = useRouter()
        const store = useStore()

        const user = store.state.user

        const eventName = ref("")

        const createEvent = async () => {
            const newEvent = await firestore.collection("events").add({
                createdBy: user.uid,
                maxSteals: 3,
                currentPlayer: null,
                started: false,
                name: eventName.value,
            })

            router.push({ ...HOME, params: { eventId: newEvent.id } })
        }

        return {
            eventName,
            Button,
            createEvent,
        }
    },
}
</script>

<style lang="scss" scoped>
</style>