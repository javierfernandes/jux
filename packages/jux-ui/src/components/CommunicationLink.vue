<template>
  <slot></slot>
</template>
<script>
// import Protocol from '@/api/Protocol'
import { provide, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const JUX_SERVICE_PORT = 5326
const JUX_PROTOCOL = 'JUX_CLIENT'

  export default {
    name: 'CommunicationLink',
    emits: [
      'onAcceptReporters',
      'onMessage',
      'onConnected',
      'onDisconnected',
      'onReporterAdded',
      'onIdentifyReporter',
    ],

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
      // reporter Level package
      const handleReporterMessage = (reporterId, msg) => {
        switch(msg.type) {
          case 'identifyReporter': this.$emit('onIdentifyReporter', { reporterId, context: msg.context }); break
          default: console.log('UNKNOWN MESSAGE FROM REPORTER', reporterId, msg)
        }
      }

      console.log('>>>> Connecting to JUX Service ...')
      const self = this
      const connect = () => {
        self.ws = new WebSocket(`ws://localhost:${JUX_SERVICE_PORT}/`, [JUX_PROTOCOL])

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
          console.log('>> INCOMING', data)
          // service Level package
          switch(data.type) {
            case 'reporterMessage': {
              console.log('>> REPORTER EVENT from', data.reporter, 'with data', data.data)
              handleReporterMessage(data.reporter, data.data)
              break
            }
            case 'acceptReporters': {
              self.$emit('onAcceptReporters', data.reporters)
              break
            }
            case 'reporterAdded': {
              self.$emit('onReporterAdded', data.reporter)
              break
            }
            default: console.log('>> UNKNOWN MESSAGE', data)
          }


          // if (data.type === Protocol.Type.RESPONSE) {
          //   this.onResponse(data)
          // } else {
          //   self.$emit('onMessage', {
          //     timestamp: event.timeStamp,
          //     ...data
          //   })
          // }
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