/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                'lumina-cyan': '#00f0ff',
                'lumina-violet': '#7000ff',
                'lumina-base': '#050505',
            },
        },
    },
    plugins: [],
}
