<template>
    <div
        class="border border-dashed rounded-xl bg-opacity-90"
        :class="{ 'bg-gray-500': dragging, 'bg-gray-800 ': !dragging }"
        @drop.prevent="addFile"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
    >
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

            <div v-if="file"><IconImage class="mb-2"></IconImage> {{ file?.name }}</div>
            <div class="text-sm">Click here or drag an image</div>
        </label>
    </div>
</template>

<script setup>
import { ref, toRefs } from "vue"
const IMAGE_TYPES = /image\/(png|jpeg|jpg)/
import { useStore } from "vuex"
import IconImage from "~icons/fa/image"

const emit = defineEmits(["update:file"])
const props = defineProps({
    file: Object,
    id: String,
})
const { file, id } = toRefs(props)
const fileEl = ref(null)
const store = useStore()

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
</script>
