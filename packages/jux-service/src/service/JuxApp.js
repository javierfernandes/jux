
/**
 * Abstract base class for Jux Apps: whether clients or reporters.
 */
class JuxApp {

  constructor(id, channel, service) {
    this.id = id
    this.channel = channel
    this.service = service

    this.channel.onMessage(m => this.onMessage(m))
    this.channel.onDisconnected(() => this._handleOnDisconnected())
  }

  getId() { return this.id }

  async onMessage(message) {
    throw new Error(`Subclass must implement onMessage() to handle: ${message}`)
  }

  send(message) {
    // console.log(`>>> [${this.class.name}-${this.id}] sending`, message)
    this.channel.send(message)
  }

  onDisconnected(fn) { this._onDisconnectedFn = fn }

  // private methods

  _handleOnDisconnected() { this._onDisconnectedFn() }

}

module.exports = JuxApp