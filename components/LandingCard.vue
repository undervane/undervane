<template>
  <div style="border: 3px solid green; background: yellow; padding: 20px;">
    <h1>LANDING CARD TEST - CAN YOU SEE THIS?</h1>
    <h1>{{title}}</h1>
    <p>{{ text || 'No text provided' }}</p>
    <button 
      style="background: red; color: white; padding: 10px; margin: 10px;"
      @click="testClick"
    >
      SIMPLE TEST BUTTON
    </button>
    <button 
      style="background: blue; color: white; padding: 10px; margin: 10px;"
      @click="handleButtonClick"
    >
      {{buttonText}}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  dark: Boolean,
  title: String,
  text: String,
  buttonText: String,
  links: Array
})

const emit = defineEmits(['buttonClick'])

const testClick = () => {
  alert('SIMPLE TEST BUTTON CLICKED!')
  console.log('Simple test button clicked')
}

const handleButtonClick = () => {
  alert('MAIN BUTTON CLICKED!')
  console.log('Main button clicked')
  emit('buttonClick')
}

console.log('LandingCard script loaded')
</script>

<style lang="scss" scoped>
  .landing-card-container {
    @apply relative z-20;
  }

  .title {
    transition: color 2s;
    @apply mb-2 relative z-10;

    @include breakpoint(xs) {
      @apply text-center mb-6;
    }
  }

  .content {
    color: $blue-light;
    word-spacing: 6px;

    @include breakpoint(xs) {
      @apply text-justify;
    }

    @apply text-lg leading-normal mb-6 pl-1;
  }

  .button {
    @apply text-lg mr-3;
    @include breakpoint(xs) {
      @apply w-full mb-6 mr-0;
    }
  }

  .links {
    display: flex;
    flex-grow: 1;
    justify-content: left;
    align-items: center;
    @apply text-xl;

    .icon {
      @apply mx-2 cursor-pointer;

      @include breakpoint(xs) {
        @apply mx-4;
      }
    }

    @include breakpoint(xs) {
      order: -1;
      justify-content: center;
      @apply text-3xl;
    }
  }

  .xs-reverse {
    display: flex;
    flex-wrap: wrap;

    @include breakpoint(xs) {
      flex-wrap: wrap-reverse;
    }
  }
</style>