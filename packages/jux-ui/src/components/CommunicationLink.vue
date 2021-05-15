<script>
  export default {
    name: 'CommunicationLink',
    emits: ['onMessage'],

    mounted() {
      console.log('connecting WS')
      const self = this
      const connect = () => {
        self.ws = new WebSocket('ws://localhost:8888/');

        self.ws.onopen = () => {
          console.log('Connected !')
        }
        self.ws.onclose = () => {
          console.log('Closed ! retrying in 5000')
          setTimeout(connect, 5000)
        }
        self.ws.onmessage = event => {
          self.$emit('onMessage', {
            timestamp: event.timeStamp,
            ...JSON.parse(event.data)
          })
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