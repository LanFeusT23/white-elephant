<template>
    <div class="text-lg">
        <div class="text-4xl text-yellow-300">
            Upload your gift image!
        </div>

        <div class="mt-2">
            <div class="text-base">Unwrapped image url (required)</div>
            <input v-model="unwrappedImageUrl" class="px-4 py-1 mb-2 text-black bg-white border rounded-lg focus:outline-none active:outline-none w-96" type="text">
        </div>

        <div>
            <div class="text-base">Wrapped image url</div>
            <input v-model="wrappedImageUrl" class="px-4 py-1 mb-2 text-black bg-white border rounded-lg focus:outline-none active:outline-none w-96" type="text">
        </div>

        <div class="mt-2">
            <div class="text-base">Brief description of the gift</div>
            <textarea v-model="giftDescription" class="h-24 px-4 py-1 mb-2 text-black bg-white border rounded-lg w-96 focus:outline-none active:outline-none"></textarea>
        </div>

        <Button @click="upload" :disabled="disableButton">Upload</Button>
    </div>
</template>

<script>
import Button from "@/components/shared/Button"
import { computed, reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { HOME } from '@/router'
import { firestore } from '@/firebase'
export default {
    setup() {
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const { uid, displayName } = store.state.user

        const gifts = firestore
            .collection("events").doc(route.params.eventId)
            .collection("gifts")

        const users = firestore
            .collection("events").doc(route.params.eventId)
            .collection("users")

        const gift = ref("")
        const user = ref("")

        const giftData = reactive({
            wrappedImageUrl: "",
            unwrappedImageUrl: "",
            giftDescription: ""
        })

        const load = async () => {
            gift.value = (await gifts.doc(uid).get()).data()
            user.value = (await users.doc(uid).get()).data()
            
            giftData.unwrappedImageUrl = gift.value.unwrappedGiftUrl
            giftData.giftDescription = gift.value.description
            
            giftData.wrappedImageUrl = user.value.wrappedGiftUrl
        }

        load()

        const disableButton = computed(() => giftData.unwrappedImageUrl === "")

        const upload = async () => {

            const newGift = await gifts.doc(uid)
                .set({
                    description: giftData.giftDescription,
                    unwrappedGiftUrl: giftData.unwrappedImageUrl
            }, { merge: true })

            const newUser = await users.doc(uid)
                .set({
                    wrappedGiftUrl: giftData.wrappedImageUrl,
                    displayName: displayName
            }, { merge: true })

            router.push(HOME)
        }

        return {
            ...toRefs(giftData),
            disableButton,
            upload,
            Button
        }
    }
}
</script>

<style lang="scss" scoped>
    .upload {
        input {
        }
    }
</style>