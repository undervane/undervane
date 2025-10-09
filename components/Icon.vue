<template>
  <nuxt-link v-if="to" :to="to" class="link" :class="theme" @click="$emit('click')">
    <font-awesome-icon class="icon" :icon="icon" :spin="spin" />
  </nuxt-link>
  <a
    v-else-if="link"
    class="link"
    :class="theme"
    target="_blank"
    :href="link"
    rel="noopener"
    :aria-label="link"
    @click="$emit('click')"
  >
    <font-awesome-icon class="icon" :icon="icon" :spin="spin" />
  </a>
  <div v-else class="link" :class="theme" @click="$emit('click')">
    <font-awesome-icon class="icon" :icon="icon" :spin="spin" />
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: [String, Array, Object],
    required: true
  },
  to: String,
  link: {
    type: String,
    default: ''
  },
  spin: Boolean,
  theme: String
})

defineEmits(['click'])
</script>

<style lang="scss" scoped>
  .link {
    transition: color 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);

    .icon {
      height: 1em;
      width: 1em;
    }
  }

  .secondary {
    color: $gray;

    &:hover {
      color: $blue-light;
    }
  }
</style>