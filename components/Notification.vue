<template>
  <div class="container">
    <transition name="notification">
      <div v-if="visible" class="notification" @click="onClick" :class="getColorByStatus">
        <Icon class="icon" :icon="getIconByStatus" />
        <p>{{notification.message}}</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Icon from '@/components/Icon.vue'

const props = defineProps({
  notification: {
    type: Object,
    default: null
  },
  fadeCountdown: {
    type: Number,
    default: 4000
  }
})

const visible = ref(false)
const fadeTimeout = ref(null)

const getColorByStatus = computed(() => {
  if (!props.notification) return 'bg-blue-light'
  
  switch (props.notification.status) {
    case 'info':
      return 'bg-blue-light'
    case 'error':
      return 'bg-red-light'
    case 'success':
      return 'bg-green-light'
    default:
      return 'bg-blue-light'
  }
})

const getIconByStatus = computed(() => {
  if (!props.notification) return 'info-circle'
  
  if (props.notification.icon) {
    return props.notification.icon
  }

  switch (props.notification.status) {
    case 'info':
      return 'info-circle'
    case 'error':
      return 'exclamation-circle'
    case 'success':
      return 'check'
    default:
      return 'info-circle'
  }
})

const onClick = () => {
  if (props.notification?.callback) {
    props.notification.callback()
  }
  visible.value = false
}

const resetTimeout = () => {
  visible.value = true

  if (fadeTimeout.value) {
    clearTimeout(fadeTimeout.value)
  }

  fadeTimeout.value = setTimeout(
    () => (visible.value = false),
    props.notification?.duration || props.fadeCountdown
  )
}

watch(() => props.notification, (newNotification) => {
  if (newNotification) {
    resetTimeout()
  }
})
</script>

<style lang="scss" scoped>
  .container {
    min-width: 100vw;
    @apply fixed bottom-0 left-0 z-50;
    @apply flex justify-center w-full;
  }

  .notification {
    bottom: 30px;
    left: 30px;
    @apply flex items-center rounded-t-lg py-3 px-4 text-white cursor-pointer;

    .icon {
      @apply pr-2 text-white;
    }
  }

  .notification-enter-active,
  .notification-leave-active {
    transition: transform 0.5s;
    transform: translateY(0);
  }
  .notification-enter,
  .notification-leave-to {
    transform: translateY(300px);
  }
</style>