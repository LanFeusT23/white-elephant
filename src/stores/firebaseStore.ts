import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useFirebaseStore = defineStore("firebase", () => {
    const user = ref();
    const fbEvent = ref();
    const setUser = (user) => (user.value = user);
    const setEvent = (event) => (event.value = fbEvent);

    const isLoggedInUsersTurn = computed(() => {
        return (
            fbEvent.value != null &&
            fbEvent.value.currentPlayer === user.value?.uid
        );
    });

    return {
        user,
        fbEvent,
        setUser,
        setEvent,
        isLoggedInUsersTurn,
    };
});
