<template>
  <!-- WIP: This vue component needs refactor -->

  <div
    :class="{'overflow-hidden': open, 'select-none': dragging}"
    @mousemove="updateDrag"
    @mouseup="endDrag"
  >
    <div
      class="panel transition"
      :style="{width: position + 'px'}"
      :class="{'closed': !open, 'dragging': dragging}"
    >
      <slot name="panel"></slot>
    </div>
    <div
      class="content-area transition"
      :class="{'open': open, 'dragging': dragging}"
      :style="{transform: open ? `translateX(${position}px)` : 'translateX(0)'}"
    >
      <div
        @mousedown="startDrag"
        @mousemove="updateIndicator"
        class="resizer-l z-10 relative"
        :class="{'dragging': dragging}"
      >
        <div class="line"></div>
        <svg class="indicator absolute" :style="{top: indicatorTop}" height="50" width="25">
          <circle cx="25" cy="25" r="25" fill="#167ef6" />
        </svg>
      </div>
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  open: Boolean
})

const emit = defineEmits(['open', 'close'])

const clicked = ref(false)
const dragging = ref(false)
const position = ref(350)
const indicatorTop = ref(0)

watch(() => props.open, (newValue) => {
  if (!newValue) {
    position.value = 350
  }
})

const startDrag = () => {
  clicked.value = true
}

const updateDrag = ({ clientX }) => {
  if (clicked.value) {
    dragging.value = true
  }
  if (dragging.value) {
    if (!props.open) {
      emit('open')
    }
    position.value =
      clientX < 500
        ? 250 < clientX && clientX < 300
          ? 300
          : clientX - 5
        : 500
  }
}

const endDrag = () => {
  if (clicked.value && !dragging.value) {
    props.open ? emit('close') : emit('open')
  }
  if (props.open && position.value < 250) {
    emit('close')
  }
  clicked.value = false
  dragging.value = false
}

const updateIndicator = ({ clientY }) => {
  indicatorTop.value = clientY - 25
}
</script>
<style lang="scss" scoped>
  .transition {
    transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .dragging {
    transition: none;
  }

  .bg-blue {
    background-color: $blue-darker;
  }

  .resizer-l {
    .indicator {
      display: none;
      transform: rotate(180deg);
    }
    .line {
      @apply h-full w-2;
    }
    cursor: grab;
    &.dragging {
      cursor: grabbing;
    }
    &:hover,
    &.dragging {
      .line {
        background-color: $blue;
      }
      .indicator {
        display: block;
      }
    }
    @include breakpoint(xs) {
      display: none;
    }
    @apply w-6 h-full fixed top-0 left-0;
  }

  .panel {
    position: fixed;
    height: 100%;
    min-height: 100vh;
    min-width: 300px;
    max-width: 500px;
    z-index: 1000;
    background-color: white;
    left: 0;
    top: 0;

    @include breakpoint(xs) {
      width: 100vw !important;
      max-width: 100vw !important;
    }
  }

  .content-area {
    width: 100%;
    min-height: 100vh;
  }

  .closed {
    transform: translateX(-350px);
    @apply pointer-events-none;

    @include breakpoint(xs) {
      transform: translateX(-100vw) !important;
    }
  }

  .open {
    @include breakpoint(xs) {
      transform: translateX(100vw) !important;
      @apply pointer-events-none h-screen;
    }
  }
</style>