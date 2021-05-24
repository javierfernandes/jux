
/**
 * A mock impl for `Channel`.
 * Allows to test all the flow without actually using websockets
 */
class MockChannel {

  constructor() {
    this.onMessage = jest.fn(this.onMessage)
    this.onConnected = jest.fn(this.onConnected)
    this.onDisconnected = jest.fn(this.onDisconnected)
    this.send = jest.fn(this.send)
  }

  // mock methods
  onConnected(fn) { this._onConnected = fn }
  onMessage(fn) { this._onMessage = fn }
  onDisconnected(fn) { this._onDisconnect = fn }
  send() {}

  //
  //

  simulateConnected() { this._onConnected() }

  simulateMessage(msg) { this._onMessage(msg) }

  simulateDisconnect() { this._onDisconnect() }
}

module.exports = MockChannel