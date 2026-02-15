/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'yt-bg': 'var(--yt-bg)',
                'yt-bg-secondary': 'var(--yt-bg-secondary)',
                'yt-bg-hover': 'var(--yt-bg-hover)',
                'yt-bg-elevated': 'var(--yt-bg-elevated)',
                'yt-text': 'var(--yt-text)',
                'yt-text-secondary': 'var(--yt-text-secondary)',
                'yt-red': 'var(--yt-red)',
                'yt-red-hover': 'var(--yt-red-hover)',
                'yt-blue': 'var(--yt-blue)',
                'yt-border': 'var(--yt-border)',
                'yt-chip': 'var(--yt-chip)',
                'yt-chip-active': 'var(--yt-chip-active)',
            },
            fontFamily: {
                'roboto': ['Roboto', 'Arial', 'sans-serif'],
            },
            letterSpacing: {
                'custom': '0.5px',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.2s ease-out',
                'scale-in': 'scale-in 0.15s ease-out',
            },
        },
    },
    plugins: [],
}
