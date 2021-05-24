const JuxService = require('./JuxService')
const MockChannel = require('../ws/MockChannel')
const ClientMessageType = require('../client/ClientMessageType')
const ReporterMessageType = require('../reporter/ReporterMessageType')

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

    describe('reporter broadcasting messages', () => {

      it('should broadcast an incoming reporter message to all clients', () => {
        const service = new JuxService()

        // add the reporter
        const reporterChannel = new MockChannel()
        const reporter = service.addReporter(reporterChannel)

        // add some clients
        const clientChannel1 = new MockChannel()
        service.addClient(clientChannel1)

        const clientChannel2 = new MockChannel()
        service.addClient(clientChannel2)

        // simulate incoming reporter message
        const message = {
          type: 'SOME_REPORTER_MESSAGE_TYPE',
          payload: { a: 'a', b: 'b' }
        }
        reporterChannel.simulateMessage(message)

        // broadcasted to both
        const expectedCallsArgs = [
          [{ type: ClientMessageType.toClient.ACCEPT_REPORTERS, reporters: [{ id: reporter.getId(), context: reporter.context }] }],
          [{ type: ClientMessageType.toClient.REPORTER_MESSAGE, reporter: reporter.getId(), message }]
        ];
        [clientChannel1, clientChannel2]
          .forEach(c => {
            expect(c.send.mock.calls).toEqual(expectedCallsArgs)
          })

      })

    })

    describe('on reporter disconnected', () => {

      it('should un-register it and broadcast a reportedRemoved message', () => {
        const service = new JuxService()

        // add the reporter
        const reporterChannel = new MockChannel()
        const reporter = service.addReporter(reporterChannel)

        // add a client
        const clientChannel = new MockChannel()
        service.addClient(clientChannel)

        // disconnect
        reporterChannel.simulateDisconnect()

        // removed
        expect(service.getReporters()).toEqual([])
        expect(clientChannel.send.mock.calls[1]).toEqual([{
          type: ClientMessageType.toClient.REPORTER_REMOVED,
          reporter: reporter.getId()
        }])
      })

    })

    describe('on client disconnected', () => {

      it('should un-register it', () => {
        const service = new JuxService()

        // add a client
        const clientChannel = new MockChannel()
        const client = service.addClient(clientChannel)

        // disconnect
        clientChannel.simulateDisconnect()

        // removed
        expect(service.getClients()).toEqual([])
      })

    })

  })

})