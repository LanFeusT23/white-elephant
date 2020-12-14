<template>
    <div class="p-8 pt-5 w-72 bg-red-1000 rounded-xl">
        <div v-if="!hasJoined" class="flex justify-center mb-4" @click="goToUpload">
            <Button>JOIN!</Button>
        </div>

        <ol class="pl-10 list-decimal">
            <li class="relative text-lg opacity-50">Firstname Lastname</li>
            <li class="relative text-lg opacity-50">Firstname Lastname</li>
            <li class="relative text-lg opacity-50">Firstname Lastname</li>
            <li class="relative text-lg opacity-50">Firstname Lastname</li>
            <li class="relative text-lg opacity-50">Firstname Lastname</li>
            <li class="relative text-lg opacity-50">Firstname Lastname</li>
            <li class="relative text-lg opacity-50">Firstname Lastname</li>
            <li class="relative text-lg opacity-50">Firstname Lastname</li>
            <li class="relative text-lg active">Firstname Lastname</li>
            <li class="relative text-lg ">Firstname Lastname</li>
            <li class="relative text-lg ">Firstname Lastname</li>
            <li class="relative text-lg ">Firstname Lastname</li>
            <li class="relative text-lg ">Firstname Lastname</li>
            <li class="relative text-lg ">Firstname Lastname</li>
            <li class="relative text-lg ">Firstname Lastname</li>
            <li class="relative text-lg ">Firstname Lastname</li>
        </ol>
    </div>
</template>

<script>
import Button from "@/components/shared/Button"
import { computed, ref } from "vue"
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import { firestore } from "@/firebase"
import { UPLOAD } from "@/router"

export default {
    setup () {
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const { uid } = store.state.user
        const users = ref([])
        
        firestore.collection("events").doc(route.params.eventId).collection("users").onSnapshot(snap => {
            let allUsers = []
            snap.forEach(user => {
                allUsers.push({
                    ...user.data(),
                    uid: user.id
                })
            });

            users.value = allUsers
        })

        const hasJoined = computed(() => {
            return users.value.some(x => x.uid === uid)
        })

        const goToUpload = () => {
            router.push(UPLOAD)
        }

        return {
            Button,
            users,
            goToUpload,
            hasJoined
        }
    }
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