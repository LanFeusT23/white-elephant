import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"
import { auth } from "@/firebase"
import store from "@/store"

export const HOME = {
    path: "/",
    name: "Home"
}

export const ABOUT = {
    path: "/about",
    name: "About"
}

export const LOGIN = {
    path: "/login",
    name: "Login"
}

const routes = [
    {
        ...HOME,
        component: Home,
        meta: {
            requiresAuth: true
        }
    },
    {
        ...ABOUT,
        component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        ...LOGIN,
        component: () => import(/* webpackChunkName: "login" */ "../views/Login.vue")
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router

export const routerGuard = (to, from, next) => {
    var user = auth.currentUser
    const isAuthenticated = store.state.user != null
    const goingToProtectedRoute = to.matched.some(record => record.meta.requiresAuth)

    if (goingToProtectedRoute && !isAuthenticated) {
        next({ ...LOGIN, query: { redirect: to.fullPath } })
    } else if (to.name === LOGIN.name && isAuthenticated) {
        next(HOME)
    } else {
        next()
    }
}

router.beforeEach(routerGuard)
