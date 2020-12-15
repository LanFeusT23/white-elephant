<template>
    <router-view class="mt-24"></router-view>
</template>

<script>
import Home from "@/views/Home.vue"
import Upload from "@/views/Upload.vue"
import { computed, toRefs, watch } from "vue";
import { useStore } from "vuex"
import { useRoute } from 'vue-router';
import { firestore } from '@/firebase';

export default {
    props: {
        eventId: String
    },
    setup (props) {

        const route = useRoute()
        const store = useStore();

        const { eventId } = toRefs(props)

        let unsubscribeEvent
        watch(eventId, (newId, oldId) => {
            unsubscribeEvent?.()

            unsubscribeEvent = firestore.collection("events").doc(newId)
                .onSnapshot(snapshot => {
                    const event = snapshot.data()

                    store.commit("setEvent", event)
            })
        }, { immediate: true })

        return {
            
        }
    }
}
</script>