<template>
  <div>
    <LateralPanel :open="open" class="loadAnimation" @open="toggleChat" @close="toggleChat">
      <template #panel>
        <Chatbox :isOpen="open" />
      </template>

      <template #content>
        <Notification :notification="notification" />
        <LightSwitch :dark="dark" :position="position">
          <NuxtPage />
        </LightSwitch>
      </template>
    </LateralPanel>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore, useChatStore, useLightStore, useNotificationStore } from '~/store'

// Components
const LightSwitch = defineAsyncComponent(() => import('~/components/LightSwitch.vue'))
const LateralPanel = defineAsyncComponent(() => import('~/components/LateralPanel.vue'))
const Chatbox = defineAsyncComponent(() => import('~/components/ChatN8N.vue'))
const Notification = defineAsyncComponent(() => import('~/components/Notification.vue'))

// Store
const store = useStore()
const chatStore = useChatStore()
const lightStore = useLightStore()
const notificationStore = useNotificationStore()

// Debug store
console.log('Layout - Store:', store)
console.log('Layout - Chat store:', chatStore)
console.log('Layout - Chat open state:', chatStore.open)

// Computed properties
const dark = computed(() => lightStore.dark)
const position = computed(() => lightStore.position)
const open = computed(() => {
  console.log('Layout - Computing open state:', chatStore.open)
  return chatStore.open
})
const notification = computed(() => notificationStore.notification)

// Methods
const toggleChat = () => {
  console.log('Layout - Toggle chat called')
  chatStore.toggleChat()
}

// Lifecycle
onMounted(async () => {
  await lightStore.calculate()
})
</script>

<style lang="scss">
  .loadAnimation {
    animation: fadeIn 2s;
  }
</style>