/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        basefont: ["SFNSRounded"]
      },
      colors: {
        brand: {
          purple: '#7667db',
          green: '#59db51',
          blue: '#6098e8',
          pink: '#da887d',
        },
      },
    },
  },
  plugins: [
    // require("@tailwindcss/forms")
  ],
}
