<template>
    <div class="text-xl" v-if="!eventHasStarted">
        <div class="text-4xl text-yellow-300">Upload your gift image!</div>

        <img v-if="loading" src="@/assets/images/candy-cane-animated.gif" alt="animated candy cane" />

        <template v-else>
            <div class="mt-2">
                <div class="text-lg">Brief description of the gift (required, max {{ giftDescription.length }} / 40 chars)</div>
                <input maxlength="40" v-model="giftDescription" class="px-4 py-1 mb-2 text-black bg-white border rounded-lg w-96 focus:outline-none active:outline-none" />
            </div>

            <div class="flex gap-8 mt-2">
                <div>
                    <div class="text-lg">Unwrapped image url (required)</div>
                    <FileUpload class="w-96" v-model:file="unWrappedFile" :id="'unwrapped'"></FileUpload>
                    <img class="object-cover mt-2 w-96 rounded-xl filter-shadow" :src="unwrappedImagePreview" />
                </div>

                <div>
                    <div class="text-lg">Wrapped image url (required)</div>
                    <FileUpload class="w-96" v-model:file="wrappedFile" :id="'wrapped'"></FileUpload>
                    <img class="object-cover mt-2 w-96 rounded-xl filter-shadow" :src="wrappedImagePreview" />
                </div>
            </div>

            <div class="flex justify-between mt-4 w-96">
                <Button @click="upload" :disabled="disableButton">Upload</Button>
                <Button @click="goToEvent" secondary>Cancel</Button>
            </div>
        </template>
    </div>
    <div v-else>
        Event has already started, you cannot change your gift!
        <router-link class="text-yellow-300" :to="HOME">Go back to event</router-link>
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
        const loading = ref(false)
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const { uid, displayName } = store.state.user
        const eventHasStarted = computed(() => {
            return store.state.event.started
        })

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
            return (
                wrappedImagePreview.value == null ||
                unwrappedImagePreview.value == null ||
                formData.giftDescription == null ||
                formData.giftDescription.trim() == "" ||
                formData.giftDescription?.length > 40 ||
                loading.value === true
            )
        })

        const upload = async () => {
            loading.value = true
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

            loading.value = false

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
            loading,
            eventHasStarted,
            HOME
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