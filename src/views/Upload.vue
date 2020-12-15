<template>
    <div class="text-lg w-96">
        <div class="text-4xl text-yellow-300">Upload your gift image!</div>

        <div class="mt-2">
            <div class="text-base">Unwrapped image url (required)</div>
            <input v-model="unwrappedImageUrl" class="w-full px-4 py-1 mb-2 text-black bg-white border rounded-lg focus:outline-none active:outline-none" type="text" />
        </div>

        <div>
            <div class="text-base">Wrapped image url</div>
            <input v-model="wrappedImageUrl" class="w-full px-4 py-1 mb-2 text-black bg-white border rounded-lg focus:outline-none active:outline-none" type="text" />
        </div>

        <div class="mt-2">
            <div class="text-base">Brief description of the gift</div>
            <textarea v-model="giftDescription" class="w-full h-24 px-4 py-1 mb-2 text-black bg-white border rounded-lg focus:outline-none active:outline-none"></textarea>
        </div>

        <div class="flex justify-between">
            <Button @click="upload" :disabled="disableButton">Upload</Button>
            <Button @click="goToEvent" secondary>Cancel</Button>
        </div>
    </div>
</template>

<script>
import Button from "@/components/shared/Button"
import { computed, reactive, ref, toRefs } from "vue"
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import { HOME } from "@/router"
import { firestore } from "@/firebase"
export default {
    setup() {
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const { uid, displayName } = store.state.user

        const eventId = route.params.eventId
        const eventRef = firestore.collection("events").doc(eventId)
        const giftsRef = eventRef.collection("gifts")
        const usersRef = eventRef.collection("users")

        const formData = reactive({
            wrappedImageUrl: "",
            unwrappedImageUrl: "",
            giftDescription: "",
        })

        const load = async () => {
            const giftDoc = await giftsRef.doc(uid).get()
            const giftData = giftDoc.data()
            formData.unwrappedImageUrl = giftData?.unwrappedGiftUrl ?? ""
            formData.giftDescription = giftData?.description ?? ""

            const userDoc = await usersRef.doc(uid).get()
            const userData = userDoc.data()
            formData.wrappedImageUrl = userData?.wrappedGiftUrl ?? ""
        }

        load()

        const disableButton = computed(() => formData.unwrappedImageUrl === "")

        const upload = async () => {
            const newGift = await giftsRef.doc(uid).set(
                {
                    selectedBy: null,
                    stolenCount: 0,
                    unwrappedGiftUrl: formData.unwrappedImageUrl,
                    description: formData.giftDescription,
                    revealed: false,
                },
                { merge: false } //false - security rules should only allow this to be updated when event hasnt been started
            )

            const newUser = await usersRef.doc(uid).set(
                {
                    wrappedGiftUrl: formData.wrappedImageUrl,
                    displayName: displayName,
                    readyToPlay: true,
                    order: null,
                    selectedGift: false,
                },
                { merge: false } //false - security rules should only allow this to be updated when event hasnt been started
            )

            router.push(HOME)
        }

        const goToEvent = () => {
            router.push(HOME)
        }

        return {
            ...toRefs(formData),
            disableButton,
            upload,
            Button,
            goToEvent
        }
    },
}
</script>

<style lang="scss" scoped>
.upload {
    input {
    }
}
</style>