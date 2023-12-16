<template>
    <div class="flex flex-col gap-4 mt-24 event-create-page justify-items-center">
        <div>
            <div>Event name</div>
            <input id="event-name" v-model="eventName" type="text" class="px-4 py-2 text-black focus:outline-none active:outline-none w-96 rounded-xl" />
        </div>
        <Button @click="createEvent"> Create Event </Button>
    </div>
</template>

<script>
import { useStore } from "vuex"
import Button from "@/components/shared/Button.vue"
import { useRouter } from "vue-router"
import { HOME } from "@/router"
import { ref, onMounted } from "vue"
import { firestore } from "@/firebase"

export default {
    setup() {
        const router = useRouter()
        const store = useStore()

        const user = store.state.user

        const eventName = ref("")

        onMounted(() => {
            document.title = "Create Event | WEEP"
        })

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

<style lang="scss" scoped></style>
