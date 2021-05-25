const MockChannel = require('./MockChannel')
const BufferingChannel = require('./BufferingChannel')

describe('BufferingChannel', () => {

  it('should buffer all messages until we connect then send them all', () => {
    const wrapped = new MockChannel()

    const channel = BufferingChannel(wrapped)

    channel.send('A')
    channel.send('B')
    channel.send('C')

    expect(wrapped.send).not.toBeCalled()

    // now connect
    wrapped.simulateConnected()

    expect(wrapped.send).toBeCalledTimes(3)
    expect(wrapped.send.mock.calls).toEqual([
      ['A'],
      ['B'],
      ['C'],
    ])
  })

  it('should not lose the original onConnected callback', () => {
    const wrapped = new MockChannel()
    // decorate
    BufferingChannel(wrapped)

    // set an original onConnect
    const onConnected = jest.fn()
    wrapped.onConnected(onConnected)

    // simulate connected
    wrapped.simulateConnected()

    // original was called
    expect(onConnected).toBeCalled()
  })

  it('should not buffer once connected', () => {
    const wrapped = new MockChannel()
    // decorate
    const channel = BufferingChannel(wrapped)

    // simulate connected
    wrapped.simulateConnected()

    channel.send('A')
    channel.send('B')
    channel.send('C')

    // not buffered
    expect(channel.getBuffer()).toEqual([])
    expect(wrapped.send.mock.calls).toEqual([
      ['A'],
      ['B'],
      ['C'],
    ])
  })

  // TODO: more work to address what happens if we get offline it will leak !

})