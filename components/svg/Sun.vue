
<template>
  <svg height="35" width="40">
    <defs>
      <radialGradient id="sun_opacity" cx="7.8" cy="1.41" r="31.25" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#fff" stop-opacity=".8" />
        <stop offset="1" stop-color="#fff" stop-opacity="0" />
      </radialGradient>
    </defs>
    <g id="Sun" class="select-none highlight-disable" :class="{ 'opacity-0': dark }">
      <circle
        id="second_thunder"
        cx="20.63"
        cy="17.61"
        r="17.61"
        class="cls-13"
        data-name="second thunder"
        opacity=".1"
      />
      <circle
        id="first_thunder"
        cx="20.63"
        cy="17.61"
        r="13.3"
        class="cls-13"
        data-name="first thunder"
        opacity=".2"
      />
      <circle id="sun-core" cx="20.85" cy="18.04" r="8.37" class="cls-13" data-name="sun" />
      <circle
        @click="event => $emit('click', event)"
        id="layer_translucent"
        cx="20.85"
        cy="18.04"
        class="cursor-pointer"
        r="8.37"
        fill="url(#sun_opacity)"
        data-name="layer translucent"
      />
    </g>
  </svg>
</template>

<script setup>
defineProps({
  dark: Boolean
})

defineEmits(['click'])
</script>

<style lang="scss" scoped>
  #layer_translucent {
    pointer-events: all;
  }

  .cls-13 {
    fill: #ffc312;
  }
</style>

