const { always } = require('ramda')
const classFactory = require('./JuxJestReporter')
const juxConnectionProvider = require('./juxConnectionProvider')
const MockChannel = require('./MockChannel')
const ReporterMessageType = require('./ReporterMessageType')
const JuxReporterConnection = require('./JuxReporterConnection')

describe('JuxJestReporter', () => {

  describe('unitary', () => {

    describe('on events', () => {

      const doTest = ({ doing, expectForwardedMessage }) => {
        // mock the jux API
        const jux = {
          send: jest.fn()
        }
        const JuxJestReporter = classFactory(always(jux))
        const globalConfig = { global: 'config' }
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

      it('should delegate "onTestStart"', () => doTest({
        doing: reporter =>
          reporter.onTestStart('myTest'),
        expectForwardedMessage: {
          type: 'onTestStart',
          test: 'myTest'
        }
      }))

      it('should delegate "onTestResult"', () => doTest({
        doing: reporter =>
          reporter.onTestResult('myTest', 'myResult', 'myAggregatedResult'),
        expectForwardedMessage: {
          type: 'onTestResult',
          test: 'myTest',
          result: 'myResult',
          aggregatedResult: 'myAggregatedResult',
        }
      }))

      it('should delegate "onTestFileStart"', () => doTest({
        doing: reporter =>
          reporter.onTestFileStart('myTest'),
        expectForwardedMessage: {
          type: 'onTestFileStart',
          test: 'myTest',
        }
      }))

      it('should delegate "onTestFileStart"', () => doTest({
        doing: reporter =>
          reporter.onTestFileResult('myTest', 'myResult', 'myAggregatedResult'),
        expectForwardedMessage: {
          type: 'onTestFileResult',
          test: 'myTest',
          result: 'myResult',
          aggregatedResult: 'myAggregatedResult',
        }
      }))

      it('should delegate "onTestCaseResult"', () => doTest({
        doing: reporter =>
          reporter.onTestCaseResult('myTest', 'myResult'),
        expectForwardedMessage: {
          type: 'onTestCaseResult',
          test: 'myTest',
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
      const reporter = new JuxJestReporter({ global: 'config' }, { option: 'A' })

      return { reporter, channel }
    }

    it('should send identityReporter upon connection', () => {
      const { channel } = createReporter()

      expect(channel.onConnected).toBeCalled()

      channel.simulateConnected()

      expect(channel.send).toBeCalledWith({
        type: ReporterMessageType.fromReporter.IDENTIFY_REPORTER,
        context: {
          globalConfig: { global: 'config' },
          options: { option: 'A' }
        }
      })
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

      // TODO:
      it.skip('should handle "fetchSourceCode" request', () => {})

    })

  })

})