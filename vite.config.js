import { fileURLToPath } from "url"
import vuePlugin from "@vitejs/plugin-vue"
import { defineConfig } from "vite"

export default defineConfig({
    plugins: [vuePlugin()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
})
