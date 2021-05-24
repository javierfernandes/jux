
/**
 * A mock impl for `Channel`.
 * Allows to test all the flow without actually using websockets
 */
class MockChannel {

  constructor() {
    this.onMessage = jest.fn(this.onMessage)
    this.onDisconnected = jest.fn(this.onDisconnected)
    this.send = jest.fn(this.send)
  }

  // mock methods
  onMessage(fn) { this._onMessage = fn }
  onDisconnected(fn) { this._onDisconnect = fn }
  send() {}

  //
  //

  simulateMessage(msg) {
    this._onMessage(msg)
  }

  simulateDisconnect() {
    this._onDisconnect()
  }
}

module.exports = MockChannel