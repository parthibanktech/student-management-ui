/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0f62fe', // Blue 60
                secondary: '#393939', // Gray 70
                accent: '#0f62fe', // Blue 60
                background: '#f4f4f4', // Gray 10
                surface: '#ffffff', // White
                text: '#161616', // Gray 100
                'text-secondary': '#525252', // Gray 60
                border: '#8d8d8d', // Gray 50
            },
            fontFamily: {
                sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            },
            borderRadius: {
                'none': '0',
                'sm': '0.125rem',
                DEFAULT: '0',
                'md': '0',
                'lg': '0',
                'xl': '0',
                '2xl': '0',
                '3xl': '0',
                'full': '9999px',
            }
        },
    },
    plugins: [],
}
