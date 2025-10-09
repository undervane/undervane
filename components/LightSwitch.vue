<template>
  <div class="relative">
    <div class="light-layer" :class="{'bg-dark': dark}" v-zIndex="zIndex - 1"></div>
    <svg class="ripple-layer" v-zIndex="zIndex">
      <circle
        class="ripple"
        :class="{'bg-dark': dark}"
        :cx="position.x"
        :cy="position.y"
        :r="ripple.radius"
      />
    </svg>
    <div class="content-layer" v-zIndex="zIndex + 1">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  dark: Boolean,
  position: Object,
  zIndex: {
    type: Number,
    default: () => -1
  }
})

const ripple = ref({ radius: 30 })
const animation = ref(null)

// Custom directive for z-index
const vZIndex = {
  mounted: (el, binding) => {
    el.style.zIndex = binding.value
  }
}

const playAnimation = () => {
  const html = document.getElementsByTagName('html')[0]
  const rippleSize =
    html.clientWidth < html.clientHeight
      ? html.clientHeight * 2
      : html.clientWidth * 2

  // Access anime through global properties
  const anime = window.$anime || window.$anime
  if (anime) {
    animation.value = anime.timeline().add({
      targets: ripple.value,
      duration: 2000,
      radius: rippleSize,
      easing: 'cubicBezier(.5,0,.5,1)'
    })
  }
}

watch(() => props.dark, () => {
  animation.value ? animation.value.restart() : playAnimation()
})

onMounted(() => {
  // Make anime available globally
  if (typeof window !== 'undefined') {
    window.$anime = window.$anime || window.$anime
  }
})
</script>

<style lang="scss" scoped>
  .light-layer {
    transition: background-color 3s, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
    @apply absolute h-full w-full bg-light;
  }

  .ripple-layer {
    @apply absolute h-full w-full min-h-screen;
  }

  .content-layer {
    @apply relative h-full w-full;
  }

  .ripple {
    @apply bg-light;
  }

  .bg-dark {
    background-color: $dark;
    fill: $dark;
  }

  .bg-light {
    background-color: $white;
    fill: $white;
  }
</style>