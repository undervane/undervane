<template>
  <div class="landing">
    <LandingCard
      class="card"
      :dark="dark"
      title="Hello, it's Sergio Márquez"
      :buttonText="open ? '← Hide chat' : 'Say hello 👋'"
      :links="links"
      @buttonClick="toggleChat"
    >
      <p class="content">
        I'm a Backend Engineer working on human interaction. I think a quality product or service depends not only on one area but in a bunch of them. My intent is to be able to explore them all and get rid of laggy experiences. Sometimes I do
        <nuxt-link to="blog">write down my thoughts</nuxt-link>.
      </p>
    </LandingCard>
    <Iceberg class="iceberg" @toggle="triggerLight" :dark="dark" :disabled="open" />
  </div>
</template>

<script>
  import Iceberg from '~/components/svg/Iceberg.vue'
  import LandingCard from '~/components/LandingCard.vue'

  export default {
    components: {
      Iceberg,
      LandingCard
    },
    data() {
      return {
        links: [
          {
            icon: ['fab', 'twitter'],
            url: 'https://twitter.com/undervane'
          },
          {
            icon: ['fab', 'linkedin'],
            url: 'https://www.linkedin.com/in/mipigu/'
          },
          {
            icon: ['fab', 'github'],
            url: 'https://github.com/undervane'
          },
          {
            icon: 'envelope',
            callback: this.copyEmail
          }
        ]
      }
    },
    computed: {
      dark() {
        return this.$store.state.light.dark
      },
      open() {
        return this.$store.state.chat.open
      }
    },
    methods: {
      triggerLight(event) {
        !this.open && this.$store.dispatch('light/trigger', event)
      },
      toggleChat() {
        this.$store.dispatch('chat/toggleChat')
      },
      copyEmail() {
        const clipboard = navigator.clipboard

        if (clipboard) {
          clipboard.writeText('sergio@mipigu.com')
          this.$store.dispatch('notification/dispatch', {
            message: 'Email copied to clipboard: sergio@mipigu.com',
            status: 'success',
            icon: 'envelope'
          })
        } else {
          this.$store.dispatch('notification/dispatch', {
            message: `Couldn't copy email to clipboard: sergio@mipigu.com`,
            status: 'error',
            icon: 'envelope',
            duration: 18000
          })
        }
      }
    },
    head() {
      return {
        title: 'Sergio Márquez | Backend Engineer',
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: `I'm a Backend Engineer working on human interaction. I think a quality product or service depends not only on one area but in a bunch of them. My intent is to be able to explore them all and get rid of laggy experiences.`
          }
        ]
      }
    }
  }
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
