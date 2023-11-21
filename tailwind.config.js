const defaultTheme = require("tailwindcss/lib/public/default-theme");
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        ...defaultTheme,
        colors: {
            ...defaultTheme.colors,
            primary: "#29416e",
            white: "#ECECEC",
            green: "#86CA62",
            red: "#DA6F61",
            yellow: "#EFAC00",
            blue: "#008BEF",
            text: {
                DEFAULT: "#121228",
                light: "#6C7281",
                frozen: "#DEDEDE",
            },
            light: {
                DEFAULT: "#FAFBFC",
                lighter: "#F3F4F6",
                frozen: "#F8F8F8",
                contrast: "#2A4C8C",
            },
        },
        extend: {},
    },
    plugins: [],
}
