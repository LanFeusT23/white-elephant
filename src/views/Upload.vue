<template>
    <div class="text-xl w-96">
        <div class="text-4xl text-yellow-300">Upload your gift image!</div>

        <div class="mt-2">
            <div class="text-lg">Unwrapped image url (required)</div>
            <FileUpload v-model="unWrappedFile" :id="'unwrappedFile'"></FileUpload>
        </div>

        <div class="mt-2">
            <div class="text-lg">Wrapped image url (required)</div>
            <FileUpload v-model="wrappedFile" :id="'wrappedFile'"></FileUpload>
        </div>

        <div class="mt-2">
            <div class="text-lg">Brief description of the gift</div>
            <input maxlength="255" v-model="giftDescription" class="w-full px-4 py-1 mb-2 text-black bg-white border rounded-lg focus:outline-none active:outline-none" />
        </div>

        <div class="flex justify-between">
            <Button @click="upload" :disabled="disableButton">Upload</Button>
            <Button @click="goToEvent" secondary>Cancel</Button>
        </div>
    </div>
</template>

<script>
import Button from "@/components/shared/Button"
import FileUpload from "@/components/shared/FileUpload"
import { computed, onMounted, reactive, ref, toRefs, watch } from "vue"
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import { HOME } from "@/router"
import { firestore, storage } from "@/firebase"

const IMAGE_TYPES = /image\/(png|jpeg|jpg)/

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

        const unWrappedFile = ref()
        const wrappedFile = ref()
        
        return {
            Button,
            FileUpload,
            ...toRefs(formData),
            disableButton,
            upload,
            goToEvent,
            wrappedFile,
            unWrappedFile
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