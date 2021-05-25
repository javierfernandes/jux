
/**
 * A mock impl for `Channel`.
 * Allows to test all the flow without actually using websockets
 */
class MockChannel {

  constructor() {
    this.connect = jest.fn(this.connect)
    this.onMessage = jest.fn(this.onMessage)
    this.onConnected = jest.fn(this.onConnected)
    this.onDisconnected = jest.fn(this.onDisconnected)
    this.onError = jest.fn(this.onError)
    this.send = jest.fn(this.send)

    this.connected = false
  }

  // methods

  onConnected(fn) { this._onConnected = fn }
  onMessage(fn) { this._onMessage = fn }
  onDisconnected(fn) { this._onDisconnect = fn }
  onError(fn) { this._onError = fn }
  send() {}
  isConnected() { return this.connected }

  //
  //

  simulateConnected() {
    this.connected = true
    this._onConnected()
  }
  simulateDisconnect() {
    this.connected = false
    this._onDisconnect()
  }
  simulateMessage(msg) { this._onMessage(msg) }
  simulateError(error) { this._onError(error) }

}

module.exports = MockChannel