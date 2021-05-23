<template>
  <slot></slot>
</template>
<script>
// import Protocol from '@/api/Protocol'
import { provide, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import JuxServiceConnection from '../api/JuxServiceConnection'

const MessageType = {
  outgoing: {
    MESSAGE_TO_REPORTER: 'messageToReporter'
  }
}

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
      const request = (reporterId, message) => {
        const id = uuidv4()
        const req = {
          type: MessageType.outgoing.MESSAGE_TO_REPORTER,
          reporterId,
          message: {
            ...message, id
          }
        }
        // console.log('>> requesting', req)
        connectionRef.value.send(req)
        return new Promise((resolve, reject) => {
          pendingMessages[id] = { resolve, reject }
        })
      }

      provide('request', request)

      return {
        onConnected(connection) {
          connectionRef.value = connection
        },
        onResponse(response) {
          const { id, value } = response
          // TODO: support incoming error rejecting here (pendingMessages[id].reject(error))
          pendingMessages[id].resolve(value)
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
      this.connection.onReporterResponse(response => this.onResponse(response))

      this.connection.connect()
    },
    unmounted() {
      console.log('closing WS')
      this.connection.close()
    }
  }
</script>