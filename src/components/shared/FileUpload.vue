<template>
    <div class="border border-dashed rounded-xl" :class="{ 'bg-red-500': dragging }" @drop.prevent="addFile" @dragover.prevent="dragging = true" @dragleave.prevent="dragging = false">
        <label class="block p-4 cursor-pointer" :for="`assetField-${id}`">
            <input
                :id="`assetField-${id}`"
                :name="`fields[assetField-${id}][]`"
                ref="fileEl"
                class="hidden w-full px-4 py-1 text-black bg-white border rounded-lg focus:outline-none active:outline-none"
                type="file"
                @change="onChangeFile"
                accept=".jpg,.jpeg,.png"
            />

            <div v-if="file"><i class="mb-2 fa fa-image"></i> {{ file?.name }}</div>
            <div class="text-sm">Click here or drag an image</div>
        </label>
    </div>
</template>

<script>
import { computed, ref, toRefs } from "vue"
const IMAGE_TYPES = /image\/(png|jpeg|jpg)/
import { useStore } from "vuex"
export default {
    props: {
        file: Object,
        id: String,
    },
    emits: ["update:file"],
    setup(props, { emit }) {
        const { file, id } = toRefs(props)
        const fileEl = ref(null)
        const store = useStore()

        const event = computed(() => {
            return store.state.event
        })

        const user = computed(() => {
            return store.state.user
        })

        const imagePreview = ref(null)
        const dragging = ref(false)

        const addFile = (e) => {
            emitFileInformation(e.dataTransfer.files)
        }

        const onChangeFile = (e) => {
            emitFileInformation(e.target.files)
        }

        const emitFileInformation = async (files) => {
            const firstFile = files?.[0]
            if (firstFile?.type?.match(IMAGE_TYPES)) {
                dragging.value = false
                // unWrappedFile.value = files[0]
                //fileEl.value.files = files
                emit("update:file", firstFile)
            } else {
                alert("Please only upload image file types!")
            }
        }

        return {
            id,
            file,
            fileEl,
            addFile,
            onChangeFile,
            dragging,
        }
    },
}
</script>