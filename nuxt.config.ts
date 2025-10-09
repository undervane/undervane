// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Enable SSR
  ssr: true,
  compatibilityDate: '2025-08-17',
  
  // Development tools
  devtools: { enabled: true },
  

  
  // CSS
  css: [
    '~/assets/scss/main.scss',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  
  // App configuration
  app: {
    head: {
      title: 'Undervane',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Personal brand webpage of Sergio Márquez'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap' 
        }
      ],

    }
  },
  
  // Build configuration
  build: {
    transpile: ['@fortawesome/vue-fontawesome', 'animejs']
  },
  
  // Vite configuration
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "sass:color"; @use "@/assets/scss/_fonts.scss" as *; @use "@/assets/scss/_mixins.scss" as *; @use "@/assets/scss/_colors.scss" as *; @use "@/assets/scss/_transitions.scss" as *;'
        }
      }
    }
  },
  
  // Runtime config
  runtimeConfig: {
    public: {
      wssHost: process.env.WSS_HOST || 'https://chatist.onrender.com'
    }
  },
  
  // Nitro configuration
  nitro: {
    compatibilityDate: '2025-08-17',
    prerender: {
      routes: ['/blog/the-dots-pattern']
    },
    routeRules: {
      '/sw.js': { headers: { 'cache-control': 'public, max-age=0, must-revalidate' } }
    }
  }
})
