const JUX_SERVICE_PORT = 5326
const JUX_PROTOCOL = 'JUX_CLIENT'

/**
 *
 */
class JuxServiceConnection {

  constructor() { }

  onDisconnected(onDisconnected) {
    this.onDisconnectedFn = onDisconnected
  }
  onConnected(onConnected) {
    this.onConnectedFn = onConnected
  }
  onReporterMessage(onReporterMessage) {
    this.onReporterMessageFn = onReporterMessage
  }
  onAcceptReporters(onAcceptReporters) {
    this.onAcceptReportersFn = onAcceptReporters
  }
  onReporterAdded(onReporterAdded) {
    this.onReporterAddedFn = onReporterAdded
  }

  connect() {
    console.log('>>>> Connecting to JUX Service ...')

    this.ws = new WebSocket(`ws://localhost:${JUX_SERVICE_PORT}/`, [JUX_PROTOCOL])

    this.ws.onopen = () => {
      console.log('Connected !')
      this.onConnectedFn?.()
    }
    this.ws.onclose = () => {
      console.log('Closed ! retrying in 5000')
      this.ws = undefined
      setTimeout(() => this.connect(), 5000)
    }

    this.ws.onmessage = event => {
      const data = JSON.parse(event.data)
      console.log('>> INCOMING', data)

      // service Level package
      switch(data.type) {
        case 'reporterMessage': {
          console.log('>> REPORTER EVENT from', data.reporter, 'with data', data.data)
          this.onReporterMessageFn?.(data.reporter, data.data)
          break
        }
        case 'acceptReporters': {
          this.onAcceptReportersFn?.(data.reporters)
          break
        }
        case 'reporterAdded': {
          this.onReporterAddedFn?.(data.reporter)
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
    this.ws.onerror = error => {
      console.log('ERROR:', error)
      this.onDisconnectedFn?.()
    }
  }
  
  close() {
    this.ws.close()
  }

  send(message) {
    this.ws.send(JSON.stringify(message))
  }
}

module.exports = JuxServiceConnection