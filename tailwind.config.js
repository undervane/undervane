/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
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
  variants: {},
  plugins: []
}
