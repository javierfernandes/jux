const JuxService = require('./JuxService')
const MockChannel = require('../ws/MockChannel')
const ClientMessageType = require('../client/ClientMessageType')

describe('JuxService', () => {

  describe('addClient', () => {

    it('should register the client and the client must accept reporters', () => {
      const service = new JuxService()
      const clientChannel = new MockChannel()
      const client = service.addClient(clientChannel)

      expect(clientChannel.send).toBeCalledWith({
        type: ClientMessageType.toClient.ACCEPT_REPORTERS,
        reporters: []
      })

      expect(service.getClients()).toEqual([client])
    })
  })

  describe('integration', () => {

    describe('client to reporter message (messageToReporter)', () => {

      it('should be able to send a message to a reporter (only that one)', () => {
        const service = new JuxService()

        // add a client
        const clientChannel = new MockChannel()
        service.addClient(clientChannel)

        // ad a target reporter
        const reporterChannel = new MockChannel()
        const reporter = service.addReporter(reporterChannel)

        // another reporter
        const anotherReporterChannel = new MockChannel()
        service.addReporter(reporterChannel)

        // simulate client message to first reporter
        clientChannel.simulateMessage({
          type: ClientMessageType.fromClient.MESSAGE_TO_REPORTER,
          reporterId: reporter.getId(),
          message: 'some message'
        })

        expect(reporterChannel.send).toBeCalledWith('some message')
        expect(anotherReporterChannel.send).not.toBeCalled()
      })

    })

  })

})