<template>
    <div class="p-8 pt-5 w-72 bg-red-1000 rounded-xl">
        <div class="flex justify-center mb-4">
            <Button @click="goToUpload">
                {{ uploadText }}
            </Button>
        </div>

        <ol class="pl-10 list-decimal">
            <li v-for="user in users" :key="user.id" class="relative text-lg">{{ user.displayName }} - {{ user.readyToPlay ? "Ready" : "Not Ready" }}</li>
        </ol>
    </div>
</template>

<script>
import Button from "@/components/shared/Button"
import { computed, ref, onUnmounted } from "vue"
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import { firestore } from "@/firebase"
import { UPLOAD } from "@/router"

export default {
    setup() {
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
                    const { newIndex, oldIndex, doc, type } = change
                    if (type === "added") {
                        users.value.splice(newIndex, 0, {
                            id: doc.id,
                            ...doc.data(),
                        })
                    } else if (type === "modified") {
                        users.value.splice(oldIndex, 1)
                        users.value.splice(newIndex, 0, {
                            id: doc.id,
                            ...doc.data(),
                        })
                    } else if (type === "removed") {
                        users.value.splice(oldIndex, 1)
                    }
                })
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

        return {
            event,
            Button,
            users,
            goToUpload,
            uploadText
        }
    },
}
</script>

<style lang="scss" scoped>
.active {
    &::before {
        position: absolute;
        font-family: "Font Awesome 5 Free";
        font-weight: 900;
        content: "\f06b";
        left: -3.5rem;
        font-size: 1.5rem;
        @apply text-yellow-400;
    }
}
</style>