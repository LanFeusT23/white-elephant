<template>
    <div class="text-xl w-96">
        <div class="text-4xl text-yellow-300">Upload your gift image!</div>

        <div class="mt-2">
            <div class="text-lg">Unwrapped image url (required)</div>
            <FileUpload v-model:file="unWrappedFile" :id="'unwrapped'"></FileUpload>
            <img :src="unwrappedImagePreview" />
        </div>

        <div class="mt-2">
            <div class="text-lg">Wrapped image url (required)</div>
            <FileUpload v-model:file="wrappedFile" :id="'wrapped'"></FileUpload>
            <img :src="wrappedImagePreview" />
        </div>

        <div class="mt-2">
            <div class="text-lg">Brief description of the gift</div>
            <input maxlength="40" v-model="giftDescription" class="w-full px-4 py-1 mb-2 text-black bg-white border rounded-lg focus:outline-none active:outline-none" />
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

function getExtension(file) {
    return file.type.split("/").pop()
}

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
            giftDescription: "",
            unwrappedImageUrl: "",
            wrappedImageUrl: "",
        })

        const unWrappedFile = ref()
        const wrappedFile = ref()

        const load = async () => {
            const giftDoc = await giftsRef.doc(uid).get()
            const giftData = giftDoc.data()
            formData.giftDescription = giftData?.description ?? ""

            formData.unwrappedImageUrl = giftData?.unwrappedGiftUrl

            const userDoc = await usersRef.doc(uid).get()
            const userData = userDoc.data()

            formData.wrappedImageUrl = userData?.wrappedGiftUrl
        }

        load()

        const unwrappedImagePreview = computed(() => {
            if (unWrappedFile.value != null) {
                return URL.createObjectURL(unWrappedFile.value)
            }

            return formData.unwrappedImageUrl
        })

        const wrappedImagePreview = computed(() => {
            if (wrappedFile.value != null) {
                return URL.createObjectURL(wrappedFile.value)
            }

            return formData.wrappedImageUrl
        })

        const disableButton = computed(() => {
            return wrappedImagePreview.value == null || unwrappedImagePreview.value == null
        })

        const upload = async () => {
            let unwrappedImageUrl = formData.unwrappedImageUrl

            if (unWrappedFile.value != null) {
                const unwrappedExtension = getExtension(unWrappedFile.value)
                const unwrappedFileRef = await storage.child(`events/${eventId}/images/${uid}/unwrapped.${unwrappedExtension}`).put(unWrappedFile.value)
                unwrappedImageUrl = await unwrappedFileRef.ref.getDownloadURL()
            }

            let wrappedImageUrl = formData.wrappedImageUrl
            if (wrappedFile.value != null) {
                const wrappedExtension = getExtension(wrappedFile.value)
                const wrappedFileRef = await storage.child(`events/${eventId}/images/${uid}/wrapped.${wrappedExtension}`).put(wrappedFile.value)
                wrappedImageUrl = await wrappedFileRef.ref.getDownloadURL()
            }

            const newGift = await giftsRef.doc(uid).set(
                {
                    revealed: false,
                    selectedBy: null,
                    stolenCount: 0,
                    unwrappedGiftUrl: unwrappedImageUrl,
                    description: formData.giftDescription,
                },
                { merge: false } //false - security rules should only allow this to be updated when event hasnt been started
            )

            const newUser = await usersRef.doc(uid).set(
                {
                    wrappedGiftUrl: wrappedImageUrl,
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
            Button,
            FileUpload,
            ...toRefs(formData),
            disableButton,
            upload,
            goToEvent,
            wrappedFile,
            unWrappedFile,
            wrappedImagePreview,
            unwrappedImagePreview,
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