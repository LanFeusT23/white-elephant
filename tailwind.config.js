module.exports = {
    purge: { content: ["./public/**/*.html", "./src/**/*.vue"] },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                body: ["Nerko One"]
            },
            colors: {
                red: {
                    1000: "#540000"
                }
            },
            boxShadow: {
                gift: "4px 4px 8px rgba(0, 0, 0, 0.5)"
            }
        }
    },
    variants: {
        extend: {
            backgroundColor: ["active"],
            opacity: ["disabled"]
        }
    },
    plugins: []
}
