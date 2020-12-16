<template>
    <div class="p-8 pt-5 w-72 bg-red-1000 bg-opacity-90 rounded-xl">
        <div class="flex justify-center mb-4" v-if="!event?.started">
            <Button @click="goToUpload">
                {{ uploadText }}
            </Button>
        </div>

        <ol class="pl-10" :class="{ 'list-decimal': event?.started }">
            <li v-for="user in users" :key="user.id" 
            class="relative text-xl" 
            :class="{ 'active': event?.currentPlayer === user.id, 'opacity-50': user.selectedGift && event?.currentPlayer !== user.id }">
                {{ user.displayName }}
            </li>
        </ol>
    </div>
</template>

<script>
import Button from "@/components/shared/Button"
import { computed, ref, onUnmounted, watch } from "vue"
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import { firestore } from "@/firebase"
import { UPLOAD } from "@/router"
import orderBy from 'lodash/orderBy'
import firebaseListChangeHelper from '@/helpers/firebaseListChangeHelper'

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
                    firebaseListChangeHelper(change, users)
                })
            })

        const orderedUsers = computed(() => {
            return orderBy(users.value, "order")
        })

        watch(orderedUsers, (newV, oldV) => {
            console.log(newV);
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
            users: orderedUsers,
            goToUpload,
            uploadText
        }
    },
}
</script>

<style lang="scss" scoped>
.active {
    @apply text-yellow-400;

    &::before {
        position: absolute;
        font-family: "Font Awesome 5 Free";
        font-weight: 900;
        content: "\f06b";
        left: -3.5rem;
        font-size: 1.5rem;
    }
}
</style>