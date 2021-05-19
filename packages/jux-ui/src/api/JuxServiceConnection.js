const JUX_SERVICE_PORT = 5326
const JUX_PROTOCOL = 'JUX_CLIENT'

/**
 * An object encapsulating the transport protocol with the JUX Service.
 * Takes care of the websocket.
 *
 * Provides callbacks (onXXX) methods to register functions.
 * ie..
 *   connection.onReporterAdded(reporter => {
 *     ...
 *   })
 *
 * It also handles reconnecting when detecting disconnection.
 *
 * And it already does a "first level" of handling the Jux Service WS Protocol.
 * There is basically a first level of messages we call "service-level".
 * This are all global events of the service.
 * I.ex.
 *   { type: 'acceptReporters', reporters: [] }
 *   { type: 'reporterAdded', reporter: { id: 'abc', context: {} } }
 *
 * Then there is a special service-level message that embeds messages emitted
 * by a particular reporter.
 *
 *   {
 *      type: 'reporterMessage',
 *      reporter: 'R1',
 *      message: {     // a "Message"
 *        type: 'onRunStart',
 *        // rest is payload, different for each message type
 *        aggregatedResults: []
 *      }
 *   }
 *
 * This class already does the "unpacking" of the first "layer".
 * And it triggers particular listeners for each one:
 *   - onAcceptReporters()
 *   - onReporterAdded()
 *   - and a generic `onReporterMessage(reporterId, message)`
 *
 * Besides it provides callbacks for connection level events like
 *   - onConnected
 *   - onDisconnected
 *
 * And it allows to send messages through @send()
 *
 */
class JuxServiceConnection {

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
          this.onReporterMessageFn?.(data.reporter, data.message)
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