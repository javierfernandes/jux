const { always } = require('ramda')
const classFactory = require('./JuxJestReporter')
const MockChannel = require('./channel/MockChannel')
const ReporterMessageType = require('./api/ReporterMessageType')
const JuxReporterConnection = require('./api/JuxReporterConnection')

describe('JuxJestReporter', () => {

  const globalConfig = { rootDir: `${__dirname}/../` }

  describe('unitary', () => {

    describe('on events', () => {
      const A_TEST = { name: 'myTest' }

      const doTest = ({ doing, expectForwardedMessage }) => {
        // mock the jux API
        const jux = {
          send: jest.fn()
        }
        const JuxJestReporter = classFactory(always(jux))
        const options = { option: 'A' }

        const reporter = new JuxJestReporter(globalConfig, options)

        doing(reporter)
        expect(jux.send).toBeCalledWith(expectForwardedMessage)
      }

      it('should delegate "onRunStart"', () => doTest({
        doing: reporter =>
          reporter.onRunStart('myAggregatedResults', 'myOptions'),
        expectForwardedMessage: {
          type: 'onRunStart',
          aggregatedResults: 'myAggregatedResults'
        }
      }))

      it('should delegate "onRunComplete"', () => doTest({
        doing: reporter =>
          reporter.onRunComplete('myContext', 'myResults'),
        expectForwardedMessage: {
          type: 'onRunComplete',
          results: 'myResults'
        }
      }))

      it('should delegate "onTestStart" renaming it', () => doTest({
        doing: reporter =>
          reporter.onTestStart(A_TEST),
        expectForwardedMessage: {
          type: 'onTestFileStart',
          test: A_TEST,
        }
      }))

      it('should delegate "onTestResult" renaming it', () => doTest({
        doing: reporter =>
          reporter.onTestResult(A_TEST, 'myResult', 'myAggregatedResult'),
        expectForwardedMessage: {
          type: 'onTestFileResult',
          test: A_TEST,
          result: 'myResult',
          aggregatedResult: 'myAggregatedResult',
        }
      }))

      it('should delegate "onTestFileStart"', () => doTest({
        doing: reporter =>
          reporter.onTestFileStart(A_TEST),
        expectForwardedMessage: {
          type: 'onTestFileStart',
          test: A_TEST,
        }
      }))

      it('should delegate "onTestFileStart"', () => doTest({
        doing: reporter =>
          reporter.onTestFileResult(A_TEST, 'myResult', 'myAggregatedResult'),
        expectForwardedMessage: {
          type: 'onTestFileResult',
          test: A_TEST,
          result: 'myResult',
          aggregatedResult: 'myAggregatedResult',
        }
      }))

      it('should delegate "onTestCaseResult"', () => doTest({
        doing: reporter =>
          reporter.onTestCaseResult(A_TEST, 'myResult'),
        expectForwardedMessage: {
          type: 'onTestCaseResult',
          test: A_TEST,
          result: 'myResult',
        }
      }))

    })

  })

  describe('integration', () => {

    // tests using the connection, only faking the ws (channel)
    const provider = channel => context => {
      const connection = new JuxReporterConnection(channel, context)
      connection.connect()
      return connection
    }

    const createReporter = () => {
      const channel = new MockChannel()
      const JuxJestReporter = classFactory(provider(channel))
      const reporter = new JuxJestReporter(globalConfig, { option: 'A' })

      return { reporter, channel }
    }

    it('should send identityReporter upon connection (contains jest version)', () => {
      const { channel } = createReporter()

      expect(channel.onConnected).toBeCalled()

      channel.simulateConnected()

      expect(channel.send.mock.calls[0]).toMatchObject([{
        type: ReporterMessageType.fromReporter.IDENTIFY_REPORTER,
        context: {
          globalConfig,
          options: { option: 'A' },
          jest: {
            version: {
              version: '26.6.3',
              major: 26,
              minor: 6,
              patch: 3
            }
          }
        }
      }])
    })

    it('should send onRunStart to the channel', () => {
      const { channel, reporter } = createReporter()

      channel.simulateConnected()

      // call it
      reporter.onRunStart('myAggregatedResults')

      expect(channel.send).toBeCalledTimes(2)

      expect(channel.send.mock.calls[1]).toEqual([{
        type: ReporterMessageType.fromReporter.ON_RUN_START,
        aggregatedResults: 'myAggregatedResults'
      }])
    })

    describe('incoming requests', () => {

      it('should handle "fetchSourceCode" request', async () => {
        const { channel } = createReporter()

        channel.simulateConnected()

        channel.simulateMessage({
          type: ReporterMessageType.toReporter.FETCH_SOURCE_CODE,
          id: 'REQUEST_ID',
          file: `${__dirname}/JuxJestReporter.spec.js`
        })

        // Wait 'cause the handler is async. There could be a better way to do this
        // but it needs design to ask the reporter for pending ops
        await new Promise(resolve => {
          setTimeout(resolve, 1000)
        })

        // initial identifyReporter + our reply
        expect(channel.send).toBeCalledTimes(2)
        expect(channel.send.mock.calls[1]).toMatchObject([{
          type: ReporterMessageType.fromReporter.RESPONSE,
          id: 'REQUEST_ID',
          value: expect.any(String)
        }])
      })

    })

  })

})