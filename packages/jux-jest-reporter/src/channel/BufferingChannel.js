
/**
 * Decorates a Channel instance to support buffering "send()" calls until the channel
 * is connected.
 * Once it gets connected then it will send everything in order and clear the buffer.
 * Implemented with JS Proxies to avoid re-writing the whole API.
 * This impl is partially implemented just enough to work with the initial case but not
 * with disconnections & reconnections. That can be added though.
 *
 * TODO: support getting offline on the go and online back without leaking
 */
const BufferingChannel = channel => new Proxy(channel, decoratorHandler(createDecorator(channel)))

/**
 * Given a channel (decoratee) returns a new object that will intercept only some
 * of its methods.
 * In this case `send()` to buffer if disconnected
 */
const createDecorator = channel => {
  let buffer = []

  // as we set our onConnected, we don't want to lose the user-level
  let otherOnConnected;
  channel.onConnected(() => {
    buffer.forEach(message => channel.send(message))
    buffer = []
    otherOnConnected && otherOnConnected()
  })

  return {
    send(message) {
      if (channel.isConnected()) {
        channel.send(message)
      } else {
        buffer.push(message)
      }
    },
    onConnected(fn) {
      otherOnConnected = fn
    },
    // added
    getBuffer() { return buffer }
  }
}

/**
 * Proxy handler that first attempts to get the member from the decorator
 * otherwise use the original object.
 */
const decoratorHandler = decorator => ({
  get(obj, prop) {
    const decorated = decorator[prop]
    return decorated ? decorated : obj[prop]
  }
})

module.exports = BufferingChannel