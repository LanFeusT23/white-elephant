<template>
    <div class="text-lg w-96">
        <div class="text-4xl text-yellow-300">Upload your gift image!</div>

        <div class="mt-2">
            <div class="text-base">Unwrapped image url (required)</div>
            <div class="border border-dashed rounded-xl" @drop.prevent="addUnWrappedFile" @dragover.prevent="dragover" @dragleave.prevent="dragleave">
                <label class="block p-4 cursor-pointer" for="unwrappedAssetField">
                    <input
                        id="unwrappedAssetField"
                        name="fields[unwrappedAssetField][]"
                        ref="unwrappedFileEl"
                        class="hidden w-full px-4 py-1 text-black bg-white border rounded-lg focus:outline-none active:outline-none" 
                        type="file"
                         @change="onChangeUnwrappedfile"
                        accept=".jpg,.jpeg,.png" />

                    <div>
                        <i class="mb-2 fa fa-image"></i> {{ unWrappedFile?.name }}
                    </div>
                    <div class="text-sm">
                        Click here or drag an image
                    </div>
                </label>
            </div>
        </div>

        <div class="mt-2">
            <div class="text-base">Wrapped image url (required)</div>
            <div class="border border-dashed rounded-xl" @drop.prevent="addWrappedFile" @dragover.prevent="dragover" @dragleave.prevent="dragleave">
                <label class="block p-4 cursor-pointer" for="wrappedAssetField">
                    <input
                        id="wrappedAssetField"
                        name="fields[wrappedAssetField][]"
                        ref="wrappedFileEl"
                        class="hidden w-full px-4 py-1 text-black bg-white border rounded-lg focus:outline-none active:outline-none" 
                        type="file"
                         @change="onChangeWrappedfile"
                        accept=".jpg,.jpeg,.png" />

                    <div>
                        <i class="mb-2 fa fa-image"></i> {{ wrappedFile?.name }}
                    </div>
                    <div class="text-sm">
                        Click here or drag an image
                    </div>
                </label>
            </div>
        </div>

        <div class="mt-2">
            <div class="text-base">Brief description of the gift</div>
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
        const unwrappedFileEl = ref(null)
        const addUnWrappedFile = (e) => {
            let files = e.dataTransfer.files;
            if (files[0].type.match(IMAGE_TYPES)) {
                e.currentTarget.classList.remove("bg-red-500")
                if(!files) return;

                unWrappedFile.value = files[0]
                unwrappedFileEl.value.files = files
                onChangeUnwrappedfile()
            }
            else {
                alert("Please only upload image file types!")
            }
        }
        const onChangeUnwrappedfile = () => {
            unWrappedFile.value = unwrappedFileEl.value.files[0]
        }
        
        const wrappedFile = ref()
        const wrappedFileEl = ref(null)
        const addWrappedFile = (e) => {
            let files = e.dataTransfer.files;
            if (files[0].type.match(IMAGE_TYPES)) {
                e.currentTarget.classList.remove("bg-red-500")
                if(!files) return;

                wrappedFile.value = files[0]
                wrappedFileEl.value.files = files
                onChangeWrappedfile()
            }
            else {
                alert("Please only upload image file types!")
            }
        }
        const onChangeWrappedfile = () => {
            wrappedFile.value = wrappedFileEl.value.files[0]
        }

        const dragover = (e) => {
            e.currentTarget.classList.add("bg-red-500")
        }

        const dragleave = (e) => {
            e.currentTarget.classList.remove("bg-red-500")
        }
        
        return {
            ...toRefs(formData),
            disableButton,
            upload,
            Button,
            goToEvent,
            dragover,
            dragleave,
            addUnWrappedFile,
            addWrappedFile,
            unwrappedFileEl,
            wrappedFileEl,
            wrappedFile,
            unWrappedFile,
            onChangeWrappedfile,
            onChangeUnwrappedfile
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