
class MockClient {

  constructor() {
    this.onMessage = jest.fn(this.onMessage)
    this.onDisconnected = jest.fn(this.onDisconnected)
    this.send = jest.fn(this.send)
  }

  // mock methods
  onMessage(fn) { this._onMessage = fn }
  onDisconnected() {}
  send() {}

  //
  //

  simulateMessage(msg) {
    this._onMessage(msg)
  }
}

module.exports = MockClient