<template>
  <div class="h-full relative bg-chat">
    <div class="h-full flex flex-col justify-between">
      <div class="md:hidden fixed top-0 w-full flex justify-end z-10 form-bg">
        <button
          class="mx-2 my-2 text-white"
          aria-label="close chat"
          @click="closeChat"
        >
          <Icon icon="arrow-right" class="h-full" />
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
            :key="index + '-' + message.text"
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
            v-if="$refs.form"
            key="last"
            class="md:hidden"
            :style="{ height: getBottomSpacer() + 'px' }"
          ></div>
        </transition-group>
      </div>
      <!-- AI Chat Banner fixed above input on mobile, inline in flow on desktop -->
      <div
        ref="banner"
        key="ai-banner"
        class="bg-blue-100 border border-blue-200 px-3 py-2 text-xs sm:text-sm text-blue-800 mx-4 md:mx-5 rounded"
        :style="bannerFixedStyle"
      >
        <div class="flex items-start">
          <Icon icon="exclamation-circle" class="mr-3 text-blue-600 mt-0.5" />
          <span>
            <strong>AI-Powered Chat:</strong> Responses might not represent my personal opinions
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
            <Icon :spin="sending" :icon="sending ? 'cog' : 'paper-plane'" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue'

export default {
  name: 'ChatN8N',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Icon
  },
  computed: {
    bannerFixedStyle() {
      if (this.isMobile && this.$refs && this.$refs.form) {
        const formHeight = this.$refs.form && this.$refs.form.clientHeight ? this.$refs.form.clientHeight : 60
        const bottomOffset = formHeight + 8
        return {
          position: 'fixed',
          left: '0',
          right: '0',
          bottom: bottomOffset + 'px',
          zIndex: 20
        }
      }
      return {}
    }
  },
  data() {
    return {
      messages: [],
      newMessage: '',
      sessionId: Math.floor(Math.random() * 1000000),
      sending: false,
      hasAskedInitialQuestion: false,
      isFirstTimeOpening: true,
      isMobile: false
    }
  },
  methods: {
    getBottomSpacer() {
      const formHeight = this.$refs && this.$refs.form && this.$refs.form.clientHeight ? this.$refs.form.clientHeight : 0
      const bannerHeight = this.isMobile && this.$refs && this.$refs.banner && this.$refs.banner.clientHeight
        ? this.$refs.banner.clientHeight + 12
        : 10
      return formHeight + bannerHeight
    },
    loadMessages() {
      try {
        const savedMessages = sessionStorage.getItem('chatMessages')
        if (savedMessages) {
          this.messages = JSON.parse(savedMessages)
        }

        const hasAskedBefore = sessionStorage.getItem('hasAskedInitialQuestion')
        if (hasAskedBefore === 'true') {
          this.hasAskedInitialQuestion = true
        }

        const savedSessionId = sessionStorage.getItem('chatSessionId')
        if (savedSessionId) {
          this.sessionId = parseInt(savedSessionId)
        }
      } catch (error) {
        console.error('Error loading messages:', error)
      }
    },

    saveMessages() {
      try {
        sessionStorage.setItem('chatMessages', JSON.stringify(this.messages))
        sessionStorage.setItem(
          'hasAskedInitialQuestion',
          this.hasAskedInitialQuestion.toString()
        )
        sessionStorage.setItem('chatSessionId', this.sessionId.toString())
      } catch (error) {
        console.error('Error saving messages:', error)
      }
    },

    clearSessionData() {
      try {
        sessionStorage.removeItem('chatMessages')
        sessionStorage.removeItem('hasAskedInitialQuestion')
        sessionStorage.removeItem('chatSessionId')
      } catch (error) {
        console.error('Error clearing session data:', error)
      }
    },
    
    async sendMessage() {
      if (!this.newMessage.trim() || this.sending) return

      const userMessage = this.newMessage.trim()
      this.newMessage = ''

      // Add user message
      this.messages.push({
        type: 'user',
        text: userMessage,
        time: new Date().toLocaleTimeString()
      })

      this.sending = true

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
              sessionId: this.sessionId,
              timestamp: new Date().toISOString()
            })
          }
        )

        if (response.ok) {
          const data = await response.json()
          // Add bot response
          this.messages.push({
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
        this.messages.push({
          type: 'bot',
          text:
            "Sorry, I'm having trouble connecting right now. Please try again later.",
          time: new Date().toLocaleTimeString()
        })
      } finally {
        this.sending = false
        this.saveMessages()
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer
      if (container) {
        // Use smooth scrolling for better UX
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        })
      }
    },
    closeChat() {
      // Directly close chat via store so mobile arrow works
      this.$store.dispatch('chat/closeChat')
    },
    handleResize() {
      if (process.client) {
        this.isMobile = window.innerWidth < 768
      }
    },
    isEmoji(value, max = 3) {
      if (typeof value !== 'string') {
        return false
      }

      const regex = /^(?:[\u2700-\u27BF]|(?:\uD83C[\uDDE6-\uDDFF]){2}|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u0023-\u0039]\uFE0F?\u20E3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff]){1,3}$/g

      return !!value.match(regex)
    },
    askInitialQuestion() {
      if (!this.hasAskedInitialQuestion) {
        this.hasAskedInitialQuestion = true
        this.saveMessages()
        // Automatically send a question on behalf of the user
        this.autoSendMessage("The user has just opened the chat, please introduce yourself in a gracious manner and ask about their name")
      }
    },
    autoSendMessage(message) {
      this.sending = true

      // Send to n8n webhook without artificial delay for initial question
      this.sendToWebhook(message)
      
      // Scroll to bottom after adding message
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    async sendToWebhook(userMessage) {
      try {
        const response = await fetch(
          'https://n8n.mipigu.com/webhook/b3729be4-dd16-4bfd-bf61-f50f9caa406f/chat',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              chatInput: userMessage,
              sessionId: this.sessionId,
              timestamp: new Date().toISOString()
            })
          }
        )

        if (response.ok) {
          const data = await response.json()
          // Add bot response
          this.messages.push({
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
        this.messages.push({
          type: 'bot',
          text:
            "Sorry, I'm having trouble connecting right now. Please try again later.",
          time: new Date().toLocaleTimeString()
        })
      } finally {
        this.sending = false
        this.saveMessages()
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    }
  },
  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      },
      deep: true
    },
    isOpen(newVal, oldVal) {
      // Only send initial message when chat is opened (not when it's closed)
      if (newVal && !oldVal) {
        console.log('Chat opened - checking for initial question')
        this.loadMessages()
        this.askInitialQuestion()
      }
    }
  },
  
  mounted() {
    console.log('ChatN8N component mounted')
    // Load messages on mount but don't send initial question yet
    this.loadMessages()
    // initialize mobile flag and listen for resizes
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
    
    // Add event listener to clear data when page is being unloaded
    window.addEventListener('beforeunload', this.clearSessionData)
  },
  
  beforeDestroy() {
    // Remove event listener and clear session data when component is destroyed
    window.removeEventListener('beforeunload', this.clearSessionData)
    window.removeEventListener('resize', this.handleResize)
    this.clearSessionData()
  }
}
</script>

<style lang="scss">
.remove-scrollbar::-webkit-scrollbar {
  width: 0px; /* remove scrollbar space */
  height: 0px; /* remove scrollbar space */
  background: transparent; /* optional: just make scrollbar invisible */
}
</style>

<style lang="scss" scoped>
.bg-chat {
  background: $blue-darker;
}

.bg-message {
  background-color: azure;
}

.form-bg {
  background: $blue-darker;
}

.bg-green-light {
  background: $green-light;
}

.dot {
  width: 11px;
  height: 8px;
  margin-left: 10px;
  margin-top: 2px;
  @apply rounded-full;
}

.send-button {
  background-color: $blue;
  @apply mr-px px-3 flex-shrink-0 text-white rounded-full;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.8s;
}
.list-enter:not(.justify-end), .list-leave-to:not(.justify-end) {
  opacity: 0;
  transform: translateX(-30px);
}
.list-enter.justify-end, .list-leave-to.justify-end {
  opacity: 0;
  transform: translateX(30px);
}

#scroller * {
  /* don't allow the children of the scrollable element to be selected as an anchor node */
  overflow-anchor: none;
}

/* Typing indicator with bouncing dots */
.typing-dots {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 5px 0;
}

.typing-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $blue;
  animation: bounce 1.4s infinite ease-in-out;
  margin: 0;
}

.typing-dots .dot:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-dots .dot:nth-child(2) {
  animation-delay: -0.16s;
}

.typing-dots .dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Ensure fixed banner sits above the input on mobile */
.ai-banner-fixed {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 20;
}
</style>
