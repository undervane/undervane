import Mode from 'frontmatter-markdown-loader/mode'

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { 
        rel: 'stylesheet', 
        href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap' 
      }
    ],
    script: [
      {
        src:
          'https://polyfill.io/v3/polyfill.js?features=IntersectionObserver%2CIntersectionObserverEntry',
        body: true,
        defer: true
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#167ef6', throttle: 0 },
  pageTransition: { name: 'page', appear: true },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/vue-anime.js',
    '@/plugins/vue-socket-io.js',
    '@/plugins/vue-lazy-image.js'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/style-resources'
  ],
  /**
   * Global Styles
   */
  styleResources: {
    scss: ['assets/scss/main.scss']
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    [
      'nuxt-fontawesome',
      {
        imports: [
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: [
              'faEnvelope',
              'faArrowRight',
              'faArrowLeft',
              'faInfoCircle',
              'faExclamationCircle',
              'faCommentDots',
              'faPaperPlane',
              'faCheck',
              'faCog',
              'faSyncAlt'
            ]
          },
          {
            set: '@fortawesome/free-brands-svg-icons',
            icons: ['faTwitter', 'faLinkedin', 'faGithub']
          }
        ]
      }
    ]
  ],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.md$/,
        loader: 'frontmatter-markdown-loader',
        options: {
          mode: [Mode.VUE_RENDER_FUNCTIONS]
        }
      })
    }
  },
  generate: {
    routes: ['/blog/the-dots-pattern']
  },
  purgeCSS: {
    mode: 'postcss',
    enabled: true,
    paths: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js'
    ],
    styleExtensions: ['.css', '.scss'],
    whitelist: ['body', 'html', 'nuxt-progress', 'font-sans', 'font-open-sans'],
    whitelistPatterns: [
      /-(leave|enter|appear)(|-(to|from|active))$/,
      /^(?!cursor-move).+-move$/,
      /^router-link(|-exact)-active$/
    ],
    extractors: [
      {
        extractor: class {
          static extract(content) {
            const contentWithoutStyleBlocks = content.replace(
              /<style[^]+?<\/style>/gi,
              ''
            )
            return (
              contentWithoutStyleBlocks.match(
                /[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g
              ) || []
            )
          }
        },
        extensions: ['html', 'vue', 'js']
      }
    ]
  },
  // PWA OPTIONS
  pwa: {
    manifest: {
      name: 'Undervane'
    }
  },
  env: {
    WSS_HOST: process.env.WSS_HOST || 'https://chatist.onrender.com'
  }
}
