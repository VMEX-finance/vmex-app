/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                basefont: ['SFNSRounded'],
            },
            colors: {
                brand: {
                    purple: {
                        DEFAULT: '#7667db',
                    },
                    blue: {
                        DEFAULT: '#6098e8',
                    },
                    pink: {
                        DEFAULT: '#da887d',
                    },
                    green: {
                        DEFAULT: '#3CB55E',
                        neon: '#59db51',
                    },
                },
            },
            keyframes: {
                'grow-input': {
                    '0%': { height: '0px' },
                    '100%': { height: '86.2px' },
                },
            },
            animation: {
                'grow-input': 'grow-input ease-in-out 1s',
            },
        },
    },
    plugins: [
        // require("@tailwindcss/forms")
    ],
};
