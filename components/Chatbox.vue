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
        v-lockToBottom
        class="flex-grow overflow-x-hidden overflow-y-auto scrolling-touch w-full pt-12 md:pt-8 px-2 md:pb-4 remove-scrollbar"
        style="overscroll-behavior-y: contain;"
      >
        <transition-group name="list" tag="div" class="h-full">
          <div
            v-for="(message, index) in messages"
            :key="`${index}-${message}`"
            class="chat-item w-full flex"
            :class="
              message.fromUser ? 'justify-end text-right' : 'justify-left'
            "
          >
            <div
              v-if="!isEmoji(message.text, 3)"
              class="px-4 py-2 text-sm bg-message m-2 block max-w-2/3 rounded-full"
            >
              <p class="p-1">{{ message.text }}</p>
            </div>

            <p v-else class="p-1 mx-1 text-5xl">{{ message.text }}</p>
          </div>
          <div
            v-if="$refs.form"
            key="last"
            class="md:hidden"
            :style="{ height: `${$refs.form.clientHeight + 10}px` }"
          ></div>
        </transition-group>
      </div>
      <form
        ref="form"
        class="w-full fixed md:relative bottom-0 form-bg py-3"
        @submit.prevent="() => send()"
      >
        <!-- WIP:Commands are temporally disabled until response parsing is implemented -->
        <!-- <transition name="commands-fade">
					<div
						v-if="this.$socket.connected"
						class="flex pl-2 pb-3 scrolling-touch overflow-x-auto remove-scrollbar"
					>
						<a
							v-for="command in commands"
							class="command-item mx-2 px-2 py-1 rounded-full bg-white"
							@click.prevent="send(command.handler)"
						>{{ command.name }}</a>
						<div class="px-2"></div>
					</div>
        </transition>-->
        <div class="flex items-center bg-white mx-4 p-1 md:p-2 rounded-full">
          <span v-show="$socket.connected" class="dot bg-green-light"></span>
          <span v-show="$socket.disconnected" class="dot bg-red-light"></span>
          <input
            v-model="message"
            v-uppercaseInitial
            :disabled="inputDisabled"
            aria-label="chat input"
            class="resize-none appearance-none bg-transparent border-none w-full mr-3 py-1 px-4 leading-tight focus:outline-none text-lg"
            :placeholder="placeholder"
          />
          <button
            class="send-button py-2 focus:outline-none"
            type="button"
            aria-label="send message"
            @click.prevent="() => send()"
          >
            <Icon
              :spin="connecting"
              :icon="
                connecting
                  ? 'cog'
                  : hasDisconnected
                  ? 'sync-alt'
                  : 'paper-plane'
              "
            />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { Socket } from 'vue-socket.io-extended'
import { sleep } from '../utils'
import Icon from '@/components/Icon.vue'

export default {
  components: {
    Icon
  },
  directives: {
    uppercaseInitial: {
      componentUpdated(el) {
        el.value = el.value.charAt(0).toUpperCase() + el.value.slice(1)
      }
    },
    lockToBottom: {
      componentUpdated(el) {
        setTimeout(() => {
          const nearEnd = 300
          const scrollIsNearEnd =
            el.scrollHeight - nearEnd < el.clientHeight + el.scrollTop

          if (scrollIsNearEnd) {
            el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
          }
        }, 100)
      }
    }
  },
  data() {
    return {
      connecting: false,
      message: '',
      commands: [
        {
          id: 0,
          name: 'Contact',
          handler: '/contact'
        },
        {
          id: 1,
          name: 'Hello',
          handler: '/hello'
        },
        {
          id: 2,
          name: 'Close',
          handler: '/close'
        },
        {
          id: 3,
          name: 'Close',
          handler: '/close'
        },
        {
          id: 4,
          name: 'Close',
          handler: '/close'
        },
        {
          id: 5,
          name: 'Close',
          handler: '/close'
        },
        {
          id: 6,
          name: 'Close',
          handler: '/close'
        },
        {
          id: 7,
          name: 'Close',
          handler: '/close'
        },
        {
          id: 8,
          name: 'Close',
          handler: '/close'
        },
        {
          id: 9,
          name: 'Close',
          handler: '/close'
        },
        {
          id: 10,
          name: 'Close',
          handler: '/close'
        }
      ]
    }
  },
  computed: {
    messages() {
      return this.$store.state.chat.messages
    },

    hasDisconnected() {
      return this.$store.state.chat.hasDisconnected
    },

    placeholder() {
      return this.$store.state.chat.placeholder || 'Say something'
    },

    inputDisabled() {
      return this.$store.state.chat.disabled
    }
  },
  watch: {
    messages() {
      const open = this.$store.state.chat.open
      if (!open) {
        this.$store.dispatch('notification/dispatch', {
          message: this.messages[this.messages.length - 1].text,
          status: 'info',
          icon: 'comment-dots',
          callback: () => this.$store.dispatch('chat/toggleChat')
        })
      }
    }
  },
  sockets: {
    async connect(obj) {
      await sleep(300)
      this.$store.dispatch('chat/addMessage', {
        text: 'Yay! Hello ' + this.$socket.client.io.opts.query.name,
        fromUser: false
      })

      this.connecting = false
      this.$store.dispatch('chat/setPlaceholder', 'Write here')
      this.$store.dispatch('chat/setDisabled', false)
    },

    disconnect(response) {
      this.$socket.client.disconnect()
      this.$store.dispatch('chat/disconnected')
    },

    response(response) {
      this.$store.dispatch('chat/addMessage', {
        text: response,
        fromUser: false
      })
    },
    smartReply(smartReply) {
      this.$store.dispatch('chat/addMessage', {
        text: smartReply,
        fromUser: false
      })
    }
  },
  methods: {
    send(message = this.message) {
      if (this.hasDisconnected) {
        this.reconnect()
        return
      }

      if (message === '' || this.connecting || this.inputDisabled) {
        return
      }

      if (this.messages.length === 2) {
        if (this.isCommand(message)) {
          return
        }

        this.$store.dispatch('chat/setDisabled', true)
        this.$store.dispatch('chat/setPlaceholder', 'Connecting...')
        this.$socket.client.io.opts.query = { name: message }
        this.$socket.client.connect()
        this.connecting = true
      } else {
        this.$socket.client.emit(
          this.isCommand(message) ? 'command' : 'message',
          message
        )
      }

      this.$store.dispatch('chat/addMessage', { text: message, fromUser: true })
      this.message = ''
    },

    closeChat() {
      this.$store.dispatch('chat/closeChat')
    },

    isEmoji(value, max = 3) {
      if (typeof value !== 'string') {
        return false
      }

      const regex = /^(?:[\u2700-\u27BF]|(?:\uD83C[\uDDE6-\uDDFF]){2}|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u0023-\u0039]\uFE0F?\u20E3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff]){1,3}$/g

      return !!value.match(regex)
    },

    reconnect() {
      this.$store.dispatch('chat/reset')
    },

    isCommand(value) {
      if (typeof value !== 'string') {
        return false
      }

      const regex = /^\/([^@\s]+)\s?(.*)$/i

      return !!value.match(regex)
    }
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
.bg-red-light {
  background: $red-light;
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
.list-enter:not(.justify-end), .list-leave-to:not(.justify-end) /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(-30px);
}
.list-enter.justify-end, .list-leave-to.justify-end /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(30px);
}

#scroller * {
  /* don't allow the children of the scrollable element to be selected as an anchor node */
  overflow-anchor: none;
}

#anchor {
  /* allow the final child to be selected as an anchor node */
  overflow-anchor: auto;

  /* anchor nodes are required to have non-zero area */
  height: 1px;
}

.commands-fade-enter-active,
.commands-fade-leave-active {
  transition: all 0.4s ease;
}

.commands-fade-enter,
.commands-fade-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}
</style>
