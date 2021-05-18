<template>
  <slot></slot>
</template>
<script>
  import { provide, ref } from 'vue'
  import { v4 as uuidv4 } from 'uuid'

  export default {
    name: 'CommunicationLink',
    emits: ['onMessage'],

    setup() {

      const client = ref()
      const pendingMessages = {

      }

      provide('request', message => {
        const id = uuidv4()
        client.value.send(JSON.stringify({ ...message, id }))
        return new Promise(resolve => {
          pendingMessages[id] = resolve
        })
      })
      return {
        onConnected(theClient) {
          client.value = theClient
        },
        onResponse(data) {
          const { id, value } = data
          // TODO: support incoming error rejecting here
          pendingMessages[id](value)
        }
      }
    },
    mounted() {
      console.log('>>>> Connecting WS')
      const self = this
      const connect = () => {
        self.ws = new WebSocket('ws://localhost:8888/');

        self.ws.onopen = () => {
          console.log('Connected !')
          self.onConnected(self.ws)
        }
        self.ws.onclose = () => {
          console.log('Closed ! retrying in 5000')
          setTimeout(connect, 5000)
        }
        self.ws.onmessage = event => {
          const data = JSON.parse(event.data)
          if (data.type === 'response') {
            this.onResponse(data)
          } else {
            self.$emit('onMessage', {
              timestamp: event.timeStamp,
              ...data
            })
          }
        }
        self.ws.onerror = error => {
          console.log('ERROR:', error)
        }
      }
      connect()
    },
    unmounted() {
      console.log('closing WS')
      this.ws.close()
    }
  }
</script>