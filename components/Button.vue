<template>
  <button class="btn focus:outline-none" :class="'btn-' + color" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: () => 'transition'
  }
})

defineEmits(['click'])
</script>

<style lang="scss" scoped>
  .btn {
    transition: box-shadow 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
      transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);

    @apply px-5 py-2 rounded-full;
  }

  .btn-transition {
    color: white;
    background: $transition;

    &:hover {
      box-shadow: 0 5px 20px $blue-light;
      transform: scale(1.05);
    }
  }

  .btn-transition-dark {
    &:hover {
      box-shadow: 0 5px 20px color.adjust($dark, $lightness: 30%);
      transform: scale(1.05);
    }
    @apply btn-transition;
  }
</style>