import { fileURLToPath } from "url"
import Vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"
import Icons from "unplugin-icons/vite"
import IconsResolver from "unplugin-icons/resolver"
import Components from "unplugin-vue-components/vite"

export default defineConfig({
    plugins: [
        Vue(),
        Components({
            resolvers: [IconsResolver()],
        }),
        Icons(),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
})
