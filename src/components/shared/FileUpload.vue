<template>
     <div class="border border-dashed rounded-xl" @drop.prevent="addFile" @dragover.prevent="dragover" @dragleave.prevent="dragleave">
        <label class="block p-4 cursor-pointer" for="unwrappedAssetField">
            <input
                id="unwrappedAssetField"
                name="fields[unwrappedAssetField][]"
                ref="fileEl"
                class="hidden w-full px-4 py-1 text-black bg-white border rounded-lg focus:outline-none active:outline-none" 
                type="file"
                    @change="onChangeFile"
                accept=".jpg,.jpeg,.png" />

            <div v-if="modelValue">
                <i class="mb-2 fa fa-image"></i> {{ modelValue?.name }}
            </div>
            <div class="text-sm">
                Click here or drag an image
            </div>
        </label>
    </div>
</template>

<script>
import { ref, toRefs } from 'vue'
import { loadFirestoreRules } from '@firebase/rules-unit-testing'
const IMAGE_TYPES = /image\/(png|jpeg|jpg)/

export default {
    props: {
        modelValue: undefined
    },
    emits: ["update:modelValue"],
    setup (props, { emit }) {
        
        const { modelValue } = toRefs(props)
        const fileEl = ref(null)
        const addFile = (e) => {
            let files = e.dataTransfer.files;
            if (files[0].type.match(IMAGE_TYPES)) {
                e.currentTarget.classList.remove("bg-red-500")
                if(!files) return;

                // unWrappedFile.value = files[0]
                fileEl.value.files = files
                onChangeFile()
            }
            else {
                alert("Please only upload image file types!")
            }
        }

        const onChangeFile = () => {
            emit("update:modelValue", fileEl.value.files[0])
        }

        const dragover = (e) => {
            e.currentTarget.classList.add("bg-red-500")
        }

        const dragleave = (e) => {
            e.currentTarget.classList.remove("bg-red-500")
        }

        return {
            modelValue,
            fileEl,
            addFile,
            onChangeFile,
            dragover,
            dragleave
        }
    }
}
</script>