<template>
  <slot></slot>
</template>
<script>
import Protocol from '@/api/Protocol'
import { provide, ref } from 'vue'
  import { v4 as uuidv4 } from 'uuid'

  export default {
    name: 'CommunicationLink',
    emits: ['onMessage', 'onConnected', 'onDisconnected'],

    setup() {

      const client = ref()

      // id - { resolve, reject }
      // keeps track of outgoing requests with a generated id so that it handles incoming responses
      // and models the whole request-response as a promise
      const pendingMessages = {}
      const request = message => {
        const id = uuidv4()
        client.value.send(JSON.stringify({ ...message, id }))
        return new Promise(resolve => {
          pendingMessages[id] = resolve
        })
      }

      provide('request', request)

      return {
        onConnected(instance) {
          client.value = instance.ws
          // get the context info on connected
          request({
            type: 'getContext'
          }).then(context => {
            instance.$emit('onInstanceConnected', context)
          })
        },
        onResponse(data) {
          const { id, value } = data
          // TODO: support incoming error rejecting here
          pendingMessages[id](value)
          delete pendingMessages[id]
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
          self.onConnected(self)
        }
        self.ws.onclose = () => {
          console.log('Closed ! retrying in 5000')
          setTimeout(connect, 5000)
        }
        self.ws.onmessage = event => {
          const data = JSON.parse(event.data)
          if (data.type === Protocol.Type.RESPONSE) {
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
          self.$emit('onDisconnected')
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