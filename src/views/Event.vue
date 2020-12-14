<template>
    <router-view class="container"></router-view>
</template>

<script>
import Home from "@/views/Home.vue"
import Upload from "@/views/Upload.vue"
import { computed } from "vue";
import { useStore } from "vuex"

export default {
    props: {
        eventId: String
    },
    setup (props) {
        const store = useStore();

        return {
            
        }
    }
}
</script>