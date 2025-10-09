import { defineStore } from 'pinia'

// Light store
export const useLightStore = defineStore('light', {
  state: () => ({
    dark: false,
    position: { x: 0, y: 0 }
  }),
  
  actions: {
    async calculate() {
      try {
        const response = await fetch('https://is-day.now.sh')
        const dayStatus = await response.json()
        
        if (!dayStatus.isDay) {
          setTimeout(() => {
            const sunElement = document.querySelector('.sun')
            if (sunElement) {
              sunElement.dispatchEvent(new Event('click'))
            }
          }, 1500)
        }
      } catch (error) {
        console.error('Error calculating day/night:', error)
      }
    },
    
    trigger(event: any) {
      // Toggle dark mode
      this.dark = !this.dark
      console.log('Light triggered:', event)
    }
  }
})

// Chat store
export const useChatStore = defineStore('chat', {
  state: () => ({
    open: false
  }),
  
  actions: {
    toggleChat() {
      console.log('Chat store - Toggling from', this.open, 'to', !this.open)
      this.open = !this.open
      console.log('Chat store - New state:', this.open)
    }
  }
})

// Notification store
export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notification: null
  }),
  
  actions: {
    setNotification(notification: any) {
      this.notification = notification
    }
  }
})

// Main store composable
export const useStore = () => {
  return {
    light: useLightStore(),
    chat: useChatStore(),
    notification: useNotificationStore()
  }
}
