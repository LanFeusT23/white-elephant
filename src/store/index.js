import { createStore } from "vuex"

export default createStore({
    state: {
        user: null,
        event: null
    },
    mutations: {
        setUser: (state, user) => (state.user = user),
        setEvent: (state, event) => (state.event = event)
    },
    getters: {
        isLoggedInUsersTurn: state => {
            return state.event != null && state.event.currentPlayer === state.user?.uid
        }
    },
    actions: {},
    modules: {}
})
