import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faTwitter, 
  faLinkedin, 
  faGithub 
} from '@fortawesome/free-brands-svg-icons'
import { 
  faEnvelope,
  faExclamationCircle,
  faArrowRight,
  faPaperPlane,
  faCog
} from '@fortawesome/free-solid-svg-icons'

// Configure FontAwesome for SSR
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false // Prevent FontAwesome from adding its CSS since we're using Nuxt

// Add icons to the library
library.add(
  // Brand icons
  faTwitter,
  faLinkedin,
  faGithub,
  // Solid icons
  faEnvelope,
  faExclamationCircle,
  faArrowRight,
  faPaperPlane,
  faCog
)

export default defineNuxtPlugin((nuxtApp) => {
  // Register the FontAwesome component globally
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
