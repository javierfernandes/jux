const JuxReporter = require('./JuxReporter')
const ReporterMessageType = require('./ReporterMessageType')
const MockChannel = require('../ws/MockChannel')

describe('JuxReporter', () => {

  describe('on messages', () => {

    describe('identifyReporter', () => {

      it('should store the context and broadcast to clients', () => {
        const client = {
          reporterMessage: jest.fn()
        }
        const channel = new MockChannel()
        const service = {
          withClients: f => f(client)
        }

        const reporter = new JuxReporter('ID', channel, service)

        // simulate incoming
        const message = {
          type: ReporterMessageType.fromReporter.IDENTIFY_REPORTER,
          context: {
            a: 'a',
            b: 'b',
          }
        }
        channel.simulateMessage(message)

        //

        expect(client.reporterMessage).toBeCalledWith(
          'ID',
          message
        )
        expect(reporter.context).toEqual(message.context)

      })

    })

  })

})