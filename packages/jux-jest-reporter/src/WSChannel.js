const WebSocket = require('ws')

const OPEN_READY_STATE = 1

/**
 * Channel impl using websockets to connect to JUX.
 * Useful abstraction to decouple a little bit the main logic
 * from "ws" allowing better testing
 */
class WSChannel {

  constructor(port, protocol) {
    this.port = port
    this.protocol = protocol
  }

  connect() {
    console.log('Connecting to JUX service...')

    this.ws = new WebSocket(`ws://localhost:${this.port}/`, [this.protocol])

    this.ws.on('open', () => {
      console.log('Connected to JUX service !')
      this._onConnectedFn()
    })

    this.ws.on('message', async messageString => {
      this._onMessageFn(JSON.parse(messageString))
    })

    this.ws.on('error', error => {
      this._onErrorFn(error)
    })
  }

  send(msg) {
    if (this.ws.readyState === OPEN_READY_STATE) {
      this.ws.send(JSON.stringify(msg))
    }
  }

  onConnected(onConnectedFn) { this._onConnectedFn = onConnectedFn }
  onMessage(onMessageFn) { this._onMessageFn = onMessageFn }
  onError(onErrorFn) { this._onErrorFn = onErrorFn }

}

module.exports = WSChannel