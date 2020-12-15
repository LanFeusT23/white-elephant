<template>
    <button :class="cssClasses" 
        class="flex justify-center w-40 px-4 py-2 disabled:opacity-50 focus:outline-none rounded-xl">
        <slot>
            Default Button!
        </slot>
    </button>
</template>

<script>
import { toRefs } from 'vue'
export default {
    props: {
        secondary: Boolean
    },
    setup(props) {
        const { secondary } = toRefs(props)

        const cssClasses = {
            "text-black bg-white active:bg-gray-300 hover:bg-opacity-80 border border-transparent": !secondary.value,
            "text-white border border-white active:bg-red-900 bg-opacity-10 hover:bg-red-800": secondary.value
        }

        return {
            cssClasses
        }
    }
}
</script>