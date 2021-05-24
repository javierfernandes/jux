const JuxClient = require('./JuxClient')
const ClientMessageType = require('./ClientMessageType')
const MockChannel = require('../ws/MockChannel')

describe('JuxClient', () => {

  describe('instantiation', () => {

    it('should send the current list of reporters', () => {
      const channel = {
        onMessage: jest.fn(),
        onDisconnected: jest.fn(),
        send: jest.fn(),
      }
      const service = {
        getReporters: jest.fn(() => [
          { id: 'REP1', context: 'context1', another: 'f' },
          { id: 'REP2', context: 'context2', another: 'f' },
          { id: 'REP3', context: 'context3', another: 'f' },
        ])
      }
      new JuxClient('ID', channel, service)

      expect(channel.send).toBeCalledWith({
        type: ClientMessageType.toClient.ACCEPT_REPORTERS,
        reporters: [
          { id: 'REP1', context: 'context1' },
          { id: 'REP2', context: 'context2' },
          { id: 'REP3', context: 'context3' },
        ]
      })
    })

  })

  describe('on messages', () => {

    describe('messageToReporter', () => {

      it('should send a message to that reporter', () => {
        const channel = new MockChannel()
        const service = {
          getReporters: jest.fn(() => []),
          sendToReporter: jest.fn()
        }

        new JuxClient('ID', channel, service)

        channel.simulateMessage({
          type: ClientMessageType.fromClient.MESSAGE_TO_REPORTER,
          reporterId: 'MY_REPORTER',
          message: {
            type: 'requesting_something',
            param: 'a'
          }
        })

        expect(service.sendToReporter).toBeCalledWith(
          'MY_REPORTER',
          { type: 'requesting_something', param: 'a' }
        )

      })

    })

  })

})