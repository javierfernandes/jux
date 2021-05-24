
/**
 * Channel implementation for websockets.
 * `Channel` puts an abstraction over the websocket to make it more explicit
 * the separation between client apps and the socket.
 * Maybe with TypeScript this could all get away.
 */
class WSChannel {

  constructor(ws) {
    this.ws = ws
  }

  send(msg) {
    this.ws.send(JSON.stringify(msg))
  }

  onMessage(fn) {
    this.ws.on('message', string => fn(JSON.parse(string)))
  }

  onDisconnected(listener) {
    this.ws.on('close', () => {
      // TODO: this doesn't seems to work
      console.log('>>> Disconnected', this.ws.protocol)
      listener()
    })
  }

}

module.exports = WSChannel