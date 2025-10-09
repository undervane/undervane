/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Open Sans', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif']
      },
      maxWidth: {
        '1-3': 'calc(100vw / 3 - 100px)',
        '1-2': 'calc(100vw / 2 - 120px)'
      },
      colors: {
        'blue-light': '#4a90e2',
        'green-light': '#38c172',
        'red-light': '#ef5753'
      }
    }
  },
  plugins: []
}
