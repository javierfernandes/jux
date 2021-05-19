<template>
  <slot></slot>
</template>
<script>
// import Protocol from '@/api/Protocol'
import { provide, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import JuxServiceConnection from '../api/JuxServiceConnection'

  export default {
    name: 'CommunicationLink',
    emits: [
      'onAcceptReporters',
      'onMessage',
      'onDisconnected',
      'onReporterAdded',
      'onReporterMessage',
    ],

    setup() {

      const connectionRef = ref()

      // id - { resolve, reject }
      // keeps track of outgoing requests with a generated id so that it handles incoming responses
      // and models the whole request-response as a promise
      const pendingMessages = {}
      const request = message => {
        const id = uuidv4()
        connectionRef.value.send({ ...message, id })
        return new Promise(resolve => {
          pendingMessages[id] = resolve
        })
      }

      provide('request', request)

      return {
        onConnected(connection) {
          connectionRef.value = connection
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
      this.connection = new JuxServiceConnection()
      // call the setup function so that it binds the client to be used in the request()
      // that is provided to lower components
      this.connection.onConnected(() => this.onConnected(this.connection))
      this.connection.onDisconnected(() => this.$emit('onDisconnected'))

      this.connection.onReporterMessage((reporterId, message) => {
        this.$emit('onReporterMessage', { reporterId, message })
      })
      this.connection.onAcceptReporters(reporters =>
        this.$emit('onAcceptReporters', reporters)
      )
      this.connection.onReporterAdded(reporter =>
        this.$emit('onReporterAdded', reporter)
      )

      this.connection.connect()
    },
    unmounted() {
      console.log('closing WS')
      this.connection.close()
    }
  }
</script>