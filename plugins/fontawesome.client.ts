import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faTwitter, 
  faLinkedin, 
  faGithub 
} from '@fortawesome/free-brands-svg-icons'
import { 
  faEnvelope, 
  faArrowRight, 
  faExclamationCircle, 
  faPaperPlane, 
  faCog 
} from '@fortawesome/free-solid-svg-icons'

// Add icons to the library
library.add(
  faTwitter, 
  faLinkedin, 
  faGithub,
  faEnvelope,
  faArrowRight,
  faExclamationCircle,
  faPaperPlane,
  faCog
)

export default defineNuxtPlugin((nuxtApp) => {
  // Register FontAwesome component globally
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
