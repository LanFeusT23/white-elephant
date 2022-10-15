/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                body: ["Nerko One"],
            },
            boxShadow: {
                gift: "4px 4px 8px rgba(0, 0, 0, 0.5)",
            },
            minWidth: {
                "40rem": "40rem",
            },
            minHeight: {
                "30rem": "30rem",
            },
            scale: {
                200: "2",
            },
        },
    },
    plugins: [],
}
