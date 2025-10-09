<template>
  <div>
    <LateralPanel :open="open" class="loadAnimation" @open="toggleChat" @close="toggleChat">
      <template v-slot:panel>
        <Chatbox :isOpen="open" />
      </template>

      <template v-slot:content>
        <Notification :notification="notification" />
        <LightSwitch :dark="dark" :position="position">
          <nuxt />
        </LightSwitch>
      </template>
    </LateralPanel>
  </div>
</template>

<script>
  import LightSwitch from '@/components/LightSwitch.vue'
  import LateralPanel from '@/components/LateralPanel.vue'

  export default {
    components: {
      LightSwitch,
      LateralPanel,
      Chatbox: () => import('@/components/ChatN8N.vue'),
      Notification: () => import('@/components/Notification.vue')
    },
    computed: {
      dark() {
        return this.$store.state.light.dark
      },
      position() {
        return this.$store.state.light.position
      },
      open() {
        return this.$store.state.chat.open
      },
      notification() {
        return this.$store.state.notification.notification
      }
    },
    mounted() {
      this.$store.dispatch('light/calculate')
    },
    methods: {
      toggleChat() {
        this.$store.dispatch('chat/toggleChat')
      }
    }
  }
</script>

<style lang="scss">
  .loadAnimation {
    animation: fadeIn 2s;
  }
</style>
