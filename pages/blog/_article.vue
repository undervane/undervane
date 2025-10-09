<template>
  <div>
    <client-only>
      <BlogNavigation
        class="p-8 sm:p-20 pb-5 sm:pb-20"
        center
        text="The DOTS Pattern"
        back="/blog"
        :dark="dark"
      />
    </client-only>

    <BlogImage
      v-if="image.url"
      maxQuality
      :url="image.url"
      :alt="image && image.alt"
      :author="image && image.author"
      :dark="dark"
    />
    <BlogContent
      :dark="dark"
      :renderFunc="renderFunc"
      :staticRenderFns="staticRenderFns"
      :extraComponent="extraComponent"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '~/store'
import BlogNavigation from '@/components/BlogNavigation.vue'
import BlogImage from '@/components/BlogImage.vue'
import BlogContent from '@/components/BlogContent.vue'

// Store
const store = useStore()

// Computed properties
const dark = computed(() => store.light.dark)

// Page data
const route = useRoute()
const router = useRouter()

const { data: pageData } = await useAsyncData('article', async () => {
  try {
    const fileContent = await import(`@/blog/${route.params.article}.md`)
    const attr = fileContent.attributes

    return {
      name: route.params.slug,
      title: attr.title,
      trans: attr.trans,
      year: attr.year,
      id: attr.id,
      owner: attr.owner,
      colors: attr.colors,
      role: attr.role,
      cardAlt: attr.cardAlt,
      noMainImage: attr.noMainImage,
      description: attr.description,
      related: attr.related,
      extraComponent: attr.extraComponent,
      renderFunc: fileContent.vue.render,
      staticRenderFns: fileContent.vue.staticRenderFns,
      image: {
        url: attr.image && attr.image.url,
        alt: attr.image && attr.image.alt,
        author: attr.image && attr.image.author
      }
    }
  } catch (e) {
    await router.push('/blog')
    return null
  }
})

// Head configuration
useHead({
  title: computed(() => `${pageData.value?.title || ''} | Blog`)
})
</script>