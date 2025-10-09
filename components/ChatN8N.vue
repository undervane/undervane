<template>
  <div class="h-full relative bg-chat">
    <div class="h-full flex flex-col justify-between">
      <div class="md:hidden fixed top-0 w-full flex justify-end z-10 form-bg">
        <button
          class="mx-2 my-2 text-white"
          aria-label="close chat"
          @click="closeChat"
        >
          <Icon :icon="faArrowRight" class="h-full" />
        </button>
      </div>
      <div
        id="scroller"
        ref="messagesContainer"
        class="flex-grow overflow-x-hidden overflow-y-auto scrolling-touch w-full pt-12 md:pt-8 px-2 md:pb-4 remove-scrollbar"
        style="overscroll-behavior-y: contain;"
      >
        <transition-group name="list" tag="div" class="h-full">
          <div
            v-for="(message, index) in messages"
            :key="`${index}-${message.text}`"
            class="chat-item w-full flex"
            :class="
              message.type === 'user'
                ? 'justify-end text-right'
                : 'justify-left'
            "
          >
            <div
              v-if="!isEmoji(message.text, 3)"
              class="px-4 py-3 text-sm bg-message m-2 block max-w-2/3 rounded-lg"
            >
              <p class="p-1">{{ message.text }}</p>
              <p class="text-xs opacity-60 ml-1">{{ message.time }}</p>
            </div>

            <div v-else class="p-1 mx-1">
              <p class="text-5xl">{{ message.text }}</p>
              <p class="text-xs opacity-60 ml-1">{{ message.time }}</p>
            </div>
          </div>
          <!-- Typing indicator with bouncing dots -->
          <div
            v-if="sending"
            key="typing"
            class="chat-item w-full flex justify-left"
          >
            <div class="px-4 py-2 text-sm bg-message m-2 block rounded-full">
              <div class="typing-dots">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
          </div>
          
          <div
            v-if="form"
            key="last"
            class="md:hidden"
            :style="{ height: `${form.clientHeight + 10}px` }"
          ></div>
        </transition-group>
      </div>
      <!-- AI Chat Banner -->
      <div
        class="bg-blue-100 border-b border-blue-300 px-4 py-3 text-sm text-blue-800 mx-5 mt-2 rounded"
      >
        <div class="flex items-center">
          <Icon :icon="faExclamationCircle" class="mr-2 text-blue-600" />
          <span>
            <strong>AI-Powered Chat:</strong> I do not have control over the responses, they might not represent my personal opinions.
          </span>
        </div>
      </div>
      <form
        ref="form"
        class="w-full fixed md:relative bottom-0 form-bg py-3"
        @submit.prevent="sendMessage"
      >
        <div class="flex items-center bg-white mx-4 p-1 md:p-2 rounded-full">
          <span class="dot bg-green-light"></span>
          <input
            v-model="newMessage"
            :disabled="sending"
            aria-label="chat input"
            class="resize-none appearance-none bg-transparent border-none w-full mr-3 py-1 px-4 leading-tight focus:outline-none text-lg"
            placeholder="Write here"
            @keyup.enter="sendMessage"
          />
          <button
            class="send-button py-2 focus:outline-none"
            type="button"
            aria-label="send message"
            :disabled="sending || !newMessage.trim()"
            @click.prevent="sendMessage"
          >
            <Icon :spin="sending" :icon="sending ? faCog : faPaperPlane" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Icon from '@/components/Icon.vue'
import { faArrowRight, faExclamationCircle, faPaperPlane, faCog } from '@fortawesome/free-solid-svg-icons'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

// Reactive data
const messages = ref([])
const newMessage = ref('')
const sessionId = ref(Math.floor(Math.random() * 1000000))
const sending = ref(false)
const hasAskedInitialQuestion = ref(false)
const isFirstTimeOpening = ref(true)
const messagesContainer = ref(null)
const form = ref(null)

// Methods
const loadMessages = () => {
  try {
    const savedMessages = sessionStorage.getItem('chatMessages')
    if (savedMessages) {
      messages.value = JSON.parse(savedMessages)
    }

    const hasAskedBefore = sessionStorage.getItem('hasAskedInitialQuestion')
    if (hasAskedBefore === 'true') {
      hasAskedInitialQuestion.value = true
    }

    const savedSessionId = sessionStorage.getItem('chatSessionId')
    if (savedSessionId) {
      sessionId.value = parseInt(savedSessionId)
    }
  } catch (error) {
    console.error('Error loading messages:', error)
  }
}

const saveMessages = () => {
  try {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages.value))
    sessionStorage.setItem(
      'hasAskedInitialQuestion',
      hasAskedInitialQuestion.value.toString()
    )
    sessionStorage.setItem('chatSessionId', sessionId.value.toString())
  } catch (error) {
    console.error('Error saving messages:', error)
  }
}

const clearSessionData = () => {
  try {
    sessionStorage.removeItem('chatMessages')
    sessionStorage.removeItem('hasAskedInitialQuestion')
    sessionStorage.removeItem('chatSessionId')
  } catch (error) {
    console.error('Error clearing session data:', error)
  }
}

const isEmoji = (text, maxLength = 3) => {
  return text.length <= maxLength && /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(text)
}

const closeChat = () => {
  emit('close')
}

const askInitialQuestion = async () => {
  if (hasAskedInitialQuestion.value) return

  const initialMessage = "Hey! I'm Sergio's AI assistant. How can I help you today?"
  
  messages.value.push({
    type: 'assistant',
    text: initialMessage,
    time: new Date().toLocaleTimeString()
  })

  hasAskedInitialQuestion.value = true
  saveMessages()
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || sending.value) return

  const userMessage = newMessage.value.trim()
  newMessage.value = ''

  // Add user message
  messages.value.push({
    type: 'user',
    text: userMessage,
    time: new Date().toLocaleTimeString()
  })

  sending.value = true

  try {
    // Add artificial delay to make the interaction feel more natural
    await new Promise((resolve) =>
      setTimeout(resolve, 1500 + Math.random() * 1000)
    )

    // Send to n8n webhook
    const response = await fetch(
      'https://n8n.mipigu.com/webhook/b3729be4-dd16-4bfd-bf61-f50f9caa406f/chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatInput: userMessage,
          sessionId: sessionId.value,
          timestamp: new Date().toISOString()
        })
      }
    )

    if (response.ok) {
      const data = await response.json()
      // Add bot response
      messages.value.push({
        type: 'bot',
        text:
          data.output ||
          "Thanks for your message! I'll get back to you soon.",
        time: new Date().toLocaleTimeString()
      })
    } else {
      throw new Error('Failed to send message')
    }
  } catch (error) {
    console.error('Error sending message:', error)
    messages.value.push({
      type: 'bot',
      text:
        "Sorry, I'm having trouble connecting right now. Please try again later.",
      time: new Date().toLocaleTimeString()
    })
  } finally {
    sending.value = false
    saveMessages()
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const scrollToBottom = () => {
  const container = messagesContainer.value
  if (container) {
    // Use smooth scrolling for better UX
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    })
  }
}

// Watch for isOpen changes
watch(() => props.isOpen, (newValue) => {
  if (newValue && isFirstTimeOpening.value) {
    loadMessages()
    askInitialQuestion()
    isFirstTimeOpening.value = false
  }
})

// Lifecycle hooks
onMounted(() => {
  if (props.isOpen) {
    loadMessages()
    askInitialQuestion()
    isFirstTimeOpening.value = false
  }
})

onBeforeUnmount(() => {
  clearSessionData()
})

// Clear session data on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', clearSessionData)
}
</script>

<style lang="scss" scoped>
.chat-item {
  animation: slideIn 0.3s ease-out;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.typing-dots {
  display: flex;
  gap: 4px;
  align-items: center;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #666;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
