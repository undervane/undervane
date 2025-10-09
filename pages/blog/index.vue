<template>
  <div class="p-8 sm:p-20 min-h-screen">
    <BlogNavigation text="What I write" back="/" :dark="dark" />
    <div class="mt-10 flex flex-wrap">
      <BlogCard
        title="The DOTS Pattern"
        to="the-dots-pattern"
        :image="{url: 'Rose%20of%20many%20colours', alt: 'Roses of many colors'}"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '~/store'
import BlogCard from '@/components/BlogCard.vue'
import BlogNavigation from '@/components/BlogNavigation.vue'

// Store
const store = useStore()

// Computed properties
const dark = computed(() => store.light.dark)

// Head configuration
useHead({
  title: 'Sergio Márquez | Blog',
  meta: [
    {
      name: 'description',
      content: `I'm a Backend Engineer working on human interaction. I think a quality product or service depends not only on one area but in a bunch of them. My intent is to be able to explore them all and get rid of laggy experiences.`
    }
  ]
})
</script>