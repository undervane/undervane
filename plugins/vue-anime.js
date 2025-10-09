import anime from 'animejs'

export default defineNuxtPlugin((nuxtApp) => {
  // Provide anime.js to Vue 2 components
  nuxtApp.vueApp.config.globalProperties.$anime = anime
})
