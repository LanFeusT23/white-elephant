import { createRouter, createWebHistory } from "vue-router"
import Landing from "../views/Landing.vue"
import { auth } from "@/firebase"
import store from "@/store"

export const ABOUT = {
    name: "About",
}

export const LOGIN = {
    name: "Login",
}

export const EVENT = {
    name: "Event",
}

export const EVENTSLANDING = {
    name: "EventsLanding",
}

export const EVENTCREATE = {
    name: "EventCreate",
}

export const HOME = {
    name: "Home",
}

export const LANDING = {
    name: "Landing",
}

export const UPLOAD = {
    name: "Upload",
}

const routes = [
    {
        ...LANDING,
        path: "/",
        component: Landing,
    },
    {
        ...EVENTCREATE,
        path: "/events/create",
        component: () => import(/* webpackChunkName: "eventCreate" */ "../views/EventCreate.vue"),
        meta: {
            requiresAuth: true,
        },
    },
    {
        ...EVENTSLANDING,
        path: "/events",
        component: () => import(/* webpackChunkName: "eventLanding" */ "../views/EventLanding.vue"),
        meta: {
            requiresAuth: true,
        },
    },
    {
        ...EVENT,
        path: "/events/:eventId",
        props: true,
        component: () => import(/* webpackChunkName: "event" */ "../views/Event.vue"),
        children: [
            {
                ...HOME,
                path: "",
                component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
            },
            {
                ...UPLOAD,
                path: "upload",
                component: () => import(/* webpackChunkName: "upload" */ "../views/Upload.vue"),
            },
        ],
        meta: {
            requiresAuth: true,
        },
    },
    {
        ...ABOUT,
        path: "/about",
        component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
    },
    {
        ...LOGIN,
        path: "/login",
        component: () => import(/* webpackChunkName: "login" */ "../views/Login.vue"),
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router

export const routerGuard = (to, from, next) => {
    var user = auth.currentUser
    const isAuthenticated = store.state.user != null
    const goingToProtectedRoute = to.matched.some((record) => record.meta.requiresAuth)

    if (goingToProtectedRoute && !isAuthenticated) {
        next({ ...LOGIN, query: { redirect: to.fullPath } })
    } else if (to.name === LOGIN.name && isAuthenticated) {
        next(LANDING)
    } else {
        next()
    }
}

router.beforeEach(routerGuard)
