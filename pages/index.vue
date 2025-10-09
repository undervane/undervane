<template>
  <div class="landing">
    <div style="background: blue; color: white; padding: 20px; border: 5px solid orange;">
      <h1>PAGE TEST - CAN YOU SEE THIS?</h1>
      <p>If you can see this, the page is rendering.</p>
      <button 
        style="background: purple; color: white; padding: 10px; margin: 10px;"
        @click="testPageClick"
      >
        PAGE TEST BUTTON
      </button>
    </div>
    <LandingCard
      class="card"
      :dark="dark"
      title="Hey there, it's Sergio!"
      :buttonText="open ? '← Hide chat' : 'Say hello 👋'"
      :links="links"
      @buttonClick="toggleChat"
    >
      <p class="content">
        I'm a software engineer working on human interaction. I think a quality
        outcome not only depends on a single area but in a balanced coordination
        of several factors. My intent is to slide through them all to get rid of
        laggy experiences. Because first impressions are important, let's work
        together to make them knowledgeable ✨
      </p>
    </LandingCard>
    <Iceberg
      class="iceberg"
      @toggle="triggerLight"
      :dark="dark"
      :disabled="open"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore, useChatStore, useLightStore, useNotificationStore } from '~/store'
import Iceberg from '~/components/svg/Iceberg.vue'
import LandingCard from '~/components/LandingCard.vue'

console.log('Page - LandingCard component:', LandingCard)
import { 
  faTwitter, 
  faLinkedin, 
  faGithub 
} from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

// Store
const store = useStore()
const chatStore = useChatStore()
const lightStore = useLightStore()
const notificationStore = useNotificationStore()

// Debug store
console.log('Page - Store:', store)
console.log('Page - Chat store:', chatStore)
console.log('Page - Chat open state:', chatStore.open)

// Computed properties
const dark = computed(() => lightStore.dark)
const open = computed(() => {
  console.log('Page - Computing open state:', chatStore.open)
  return chatStore.open
})



// Methods
const testPageClick = () => {
  alert('PAGE TEST BUTTON CLICKED!')
  console.log('Page test button clicked')
}

const triggerLight = (event) => {
  if (!open.value) {
    lightStore.trigger(event)
  }
}

const toggleChat = () => {
  alert('PAGE TOGGLE CHAT CALLED!')
  console.log('Page - Toggle chat called')
  console.log('Page - Chat store before toggle:', chatStore)
  console.log('Page - Chat open state before toggle:', chatStore.open)
  chatStore.toggleChat()
  console.log('Page - Chat open state after toggle:', chatStore.open)
}

const copyEmail = () => {
  const clipboard = navigator.clipboard

  if (clipboard) {
    clipboard.writeText('sergio@mipigu.com')
    notificationStore.setNotification({
      message: 'Email copied to clipboard: sergio@mipigu.com',
      status: 'success',
      icon: faEnvelope
    })
  } else {
    notificationStore.setNotification({
      message: `Couldn't copy email to clipboard: sergio@mipigu.com`,
      status: 'error',
      icon: faEnvelope,
      duration: 18000
    })
  }
}

// Reactive data
const links = ref([
  {
    icon: faTwitter,
    url: 'https://twitter.com/undervane'
  },
  {
    icon: faLinkedin,
    url: 'https://www.linkedin.com/in/mipigu/'
  },
  {
    icon: faGithub,
    url: 'https://github.com/undervane'
  },
  {
    icon: faEnvelope,
    callback: copyEmail
  }
])

// Head configuration
useHead({
  title: 'Sergio Márquez | Engineer',
  meta: [
    {
      name: 'description',
      content: `
      I'm a software engineer working on human interaction. 
    I think a quality outcome not only depends on a single 
    area but in a balanced coordination of several factors. 
    My intent is to slide through them all to get rid of laggy 
    experiences. Because first impressions are important, 
    let's work together to make them knowledgeable ✨`
    }
  ]
})
</script>

<style lang="scss">
.landing {
  @apply flex justify-around items-center content-center flex-wrap-reverse;
  @apply min-h-screen w-full max-w-full overflow-hidden;
}

.card {
  max-width: 450px;
  @apply w-full ml-4 mt-4 mb-8;
  @include breakpoint(xs) {
    @apply p-4 ml-0 mt-0;
  }
}

.iceberg {
  max-width: 40rem;
  @apply h-full w-full p-3;

  @include breakpoint(lg) {
    transform: scale(1.2) translateX(40px) translateY(30px);
  }
  @include breakpoint(xs) {
    @apply px-6;
  }
}

.content {
  color: $blue-light;
  word-spacing: 7px;

  a {
    font-weight: 600;

    &:hover {
      border-bottom: 1.5px solid;
    }

    @media (hover: none) and (pointer: coarse) {
      border-bottom: 1.5px solid;
    }
  }

  @include breakpoint(xs) {
    @apply text-justify;
  }

  @apply text-lg leading-normal mb-6 pl-1;
}
</style>
