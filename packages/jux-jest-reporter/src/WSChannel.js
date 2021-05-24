const WebSocket = require('ws')

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
  }

  send(msg) {
    this.ws.send(JSON.stringify(msg))
  }

  onConnected(onConnectedFn) { this._onConnectedFn = onConnectedFn }
  onMessage(onMessageFn) { this._onMessageFn = onMessageFn }

}

module.exports = WSChannel